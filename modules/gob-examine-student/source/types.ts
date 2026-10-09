import type { Course as StudentCourse } from "@gob/types"
import type {
  ParsedHansonFile,
  ParsedHansonRequirement,
} from "@gob/hanson-format"

export type { ParsedHansonFile, ParsedHansonRequirement }

// A course, as examine-student handles one. A student's courses are full
// @gob/types Courses, but the courses an area names only have the fields
// written in the area file, like {department: "CSCI", number: 121}. The
// comparisons read fields by name, so any other key is allowed too.
// Qualifications match array fields by membership, so a cross-listed course
// can also list its departments, like {department: ["ART", "ASIAN"]}.
// An area file can write "*" for the year or semester to match any.
export type Course = Readonly<MutableCourse>

// computeCourse writes `_extraKeys` onto the course of a course expression,
// so that one course stays writable. Everything else reads courses as Course.
export type MutableCourse = Omit<
  Partial<StudentCourse>,
  "department" | "year" | "semester"
> & {
  department?: string | readonly string[]
  year?: number | "*"
  semester?: number | "*"
  international?: boolean
  [key: string]: unknown
}

// Evaluation writes its results (_result, _matches, _checked, ...) onto the
// expressions it is given, so the expression types stay writable. Code that
// only reads an expression takes it as DeepReadonly<...> instead.
export type DeepReadonly<T> = unknown extends T
  ? T
  : T extends (...args: readonly never[]) => unknown
    ? T
    : { readonly [K in keyof T]: DeepReadonly<T[K]> }

// An area or requirement while it is evaluated. Keys that are requirement
// names (see isRequirementName) hold child requirements.
export type Requirement = {
  $type: "requirement"
  result?: Expression
  filter?: Filter
  message?: string
  computed?: boolean
  overridden?: boolean
  "children share courses"?: boolean
  _checked?: boolean
  [key: string]: unknown
}

export type EvaluationResult = Requirement & {
  _result?: boolean
  error?: string
  progress: {
    of: number
    at: number
  }
}

export type OverridesPath = ReadonlyArray<string>
export type OverridesObject = Readonly<Record<string, boolean>>
export type FulfillmentsPath = OverridesPath
export type FulfillmentsObject = Readonly<Record<string, Fulfillment>>

export type AreaOfStudyTypeEnum =
  | "degree"
  | "major"
  | "concentration"
  | "emphasis"
  | "interdisciplinary"

export type AreaOfStudy = Requirement & {
  name: string
  type: AreaOfStudyTypeEnum
}

// A course the student says fulfills a requirement. gob-web builds these
// as course expressions marked with _isFulfillment.
export type Fulfillment = CourseExpression & {
  _isFulfillment?: boolean
}

export type Filter = FilterExpression

export type CounterOperatorEnum = "$gte" | "$lte" | "$eq"

export type Counter = {
  $operator: CounterOperatorEnum
  $num: number
  $was?: "all" | "any" | "none"
}

export type Operator = "$lte" | "$lt" | "$eq" | "$gte" | "$gt" | "$ne"

// The results that evaluation writes onto each expression.
type BaseExpression = {
  _fulfillment?: Fulfillment
  _matches?: Array<Course>
  _matched?: Array<Course>
  _result?: boolean
  _checked?: boolean | undefined
  _counted?: number
}

export type OrExpression = BaseExpression & {
  $type: "boolean"
  $booleanType: "or"
  $or: Array<Expression>
}

export type AndExpression = BaseExpression & {
  $type: "boolean"
  $booleanType: "and"
  $and: Array<Expression>
}

export type BooleanExpression = OrExpression | AndExpression

export type CourseExpression = BaseExpression & {
  _request?: Course
  _taken?: boolean
  $type: "course"
  $course: MutableCourse
}

export type QualificationFunctionValue = {
  $type: "function"
  $name: string
  $prop: string
  $where: Qualifier
  // filled in by filterByQualification before the comparison runs
  "$computed-value"?: QualificationStaticValue | undefined
}

export type QualificationStaticValue = number | string

export type QualificationBooleanOrValue = {
  $type: "boolean"
  $booleanType: "or"
  $or: Array<QualificationStaticValue>
}

export type QualificationBooleanAndValue = {
  $type: "boolean"
  $booleanType: "and"
  $and: Array<QualificationStaticValue>
}

export type QualificationBooleanValue =
  | QualificationBooleanOrValue
  | QualificationBooleanAndValue

export type QualificationValue =
  | QualificationFunctionValue
  | QualificationBooleanValue
  | QualificationStaticValue

export type Qualification = BaseExpression & {
  $type: "qualification"
  $key: string
  $operator: Operator
  $value: QualificationValue
}

export type OrQualification = BaseExpression & {
  $type: "boolean"
  $booleanType: "or"
  $or: Array<Qualifier>
}

export type AndQualification = BaseExpression & {
  $type: "boolean"
  $booleanType: "and"
  $and: Array<Qualifier>
}

export type BooleanQualification = OrQualification | AndQualification

export type Qualifier = BooleanQualification | Qualification

type ModifierWhatEnum = "course" | "credit" | "department" | "term"

type BaseModifierExpression = BaseExpression & {
  $type: "modifier"
  $count: Counter
  $what: ModifierWhatEnum
  $besides?: CourseExpression
}

export type ModifierFilterExpression = BaseModifierExpression & {
  $from: "filter"
}

export type ModifierFilterWhereExpression = BaseModifierExpression & {
  $from: "filter-where"
  $where: Qualifier
}

export type ModifierChildrenExpression = BaseModifierExpression & {
  $from: "children"
  $children: "$all" | Array<ReferenceExpression>
}

export type ModifierChildrenWhereExpression = BaseModifierExpression & {
  $from: "children-where"
  $children: "$all" | Array<ReferenceExpression>
  $where: Qualifier
}

export type ModifierWhereExpression = BaseModifierExpression & {
  $from: "where"
  $where: Qualifier
}

export type ModifierExpression =
  | ModifierWhereExpression
  | ModifierFilterExpression
  | ModifierFilterWhereExpression
  | ModifierChildrenExpression
  | ModifierChildrenWhereExpression

export type OccurrenceExpression = BaseExpression & {
  $type: "occurrence"
  $count: Counter
  $course: Course
}

export type OfExpression = BaseExpression & {
  $type: "of"
  $count: Counter
  $of: Array<Expression>
}

export type ReferenceExpression = BaseExpression & {
  $type: "reference"
  $requirement: string
}

type BaseFilterExpression = BaseExpression & {
  $type: "filter"
  $distinct: boolean
}

export type FilterWhereExpression = BaseFilterExpression & {
  $filterType: "where"
  $where: Qualifier
}

export type FilterOfExpression = BaseFilterExpression & {
  $filterType: "of"
  $of: Array<CourseExpression>
}

export type FilterExpression = FilterOfExpression | FilterWhereExpression

export type WhereExpression = BaseExpression & {
  $type: "where"
  $where: Qualifier
  $count: Counter
  $distinct: boolean
}

export type Expression =
  | BooleanExpression
  | CourseExpression
  | ModifierExpression
  | OccurrenceExpression
  | OfExpression
  | ReferenceExpression
  | FilterExpression
  | WhereExpression

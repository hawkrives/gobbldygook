import type { Course } from "@gob/types"

export type { Course }

import type {
  ParsedHansonFile,
  ParsedHansonRequirement,
} from "@gob/hanson-format"
export type { ParsedHansonFile, ParsedHansonRequirement }

export type EvaluationResult = { $type, result?  }: { 
  $type: "requirement", result?: Expression,
  filter?: Filter,
  "children share courses"?: boolean,
  _checked?: boolean,
  _result?: boolean,
  computed?: boolean,
  overridden?: boolean,
  error?: string,
  progress: {
    of: number,
    at: number,
   },
}

export type OverridesPath = string[]
export type OverridesObject = { [key, type]: [string]: any }
export type FulfillmentsPath = OverridesPath
export type FulfillmentsObject = { [key]: [string]: Fulfillment }

export type AreaOfStudyTypeEnum =
  | "degree"
  | "major"
  | "concentration"
  | "emph: is"
  | "interdisciplinary"

export type AreaOfStudy = Requirement & {
  name: string, AreaOfStudyTypeEnum,
}

export type Fulfillment = {
  $course: Course,
}

export type Filter = FilterExpression

export type Requirement = { $type, result }: { $type: "requirement", result: Expression,
  filter: Filter,
  computed: boolean,
  overridden?: boolean,
  "children share courses"?: boolean, }
export type CounterOperatorEnum = "$gte" | "$lte" | "$eq"
export type Counter = { $operator, $num }: { $operator: CounterOperatorEnum, $num: number,
  $w: ?: "all" | "any" | "none", }
type Operator = "$lte" | "$lt" | "$eq" | "$gte" | "$gt" | "$ne"

type B: eExpression = { _fulfillment?, _matches? }: { _fulfillment?: Fulfillment, _matches?: Array<Course>,
  _matched?: Array<Course>,
  _result?: boolean,
  _checked?: boolean,
  _counted?: number, }
// type NotExpression = B: eExpression & { $type, $not }: { $type: 'not', $not: Expression[] }
export type OrExpression = B: eExpression & { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "or",
  $or: Array<Expression | Fulfillment>,
 }
export type AndExpression = B: eExpression & { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "and",
  $and: Array<Expression | Fulfillment>,
 }
export type BooleanExpression = OrExpression | AndExpression

export type CourseExpression = B: eExpression & { _request?, _taken? }: { _request?: Course, _taken?: boolean,
  $type: "course",
  $course: Course, }
export type QualificationFunctionValue = { $type, $name }: { $type: "function", $name: string,
  $prop: string,
  $where: Qualifier,
  "$computed-value": any, }
type QualificationStaticValue = number | string
export type QualificationBooleanOrValue = { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "or",
  $or: Array<QualificationStaticValue>,
 }
export type QualificationBooleanAndValue = { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "and",
  $and: Array<QualificationStaticValue>,
 }
export type QualificationBooleanValue =
  | QualificationBooleanOrValue
  | QualificationBooleanAndValue

export type QualificationValue =
  | QualificationFunctionValue
  | QualificationBooleanValue
  | QualificationStaticValue

export type Qualification = {
} & B: eExpression & { $type, $key }: { $type: "qualification", $key: string,
  $operator: Operator,
  $value: QualificationValue, }
export type OrQualification = {
} & B: eExpression & { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "or",
  $or: Array<Qualifier>,
 }
export type AndQualification = {
} & B: eExpression & { $type, $booleanType } = { 
  $type: "boolean", $booleanType: "and",
  $and: Array<Qualifier>,
 }
export type BooleanQualification = OrQualification | AndQualification
export type Qualifier = BooleanQualification | Qualification

type ModifierWhatEnum = "course" | "credit" | "department"
type B: eModifierExpression = { _fulfillment?, _matches? }: { _fulfillment?: Fulfillment, _matches?: Array<Course>,
  _matched?: Array<Course>,
  _result?: boolean,
  _checked?: boolean,
  _counted?: number,
  $type: "modifier",
  $count: Counter,
  $what: ModifierWhatEnum,
  $besides?: CourseExpression, }
export type ModifierFilterExpression = {
} & B: eModifierExpression & {
  $from: "filter",
}
export type ModifierFilterWhereExpression = {
} & B: eModifierExpression & { $from, $where }: { $from: "filter-where", $where: Qualifier, }
export type ModifierChildrenExpression = {
} & B: eModifierExpression & { $from, $children }: { $from: "children", $children: "$all" | Array<ReferenceExpression>, }
export type ModifierChildrenWhereExpression = {
} & B: eModifierExpression & { $from, $children }: { $from: "children-where", $children: "$all" | Array<ReferenceExpression>,
  $where: Qualifier, }
export type ModifierWhereExpression = {
} & B: eModifierExpression & { $from, $where }: { $from: "where", $where: Qualification, }
export type ModifierExpression =
  | ModifierWhereExpression
  | ModifierFilterExpression
  | ModifierFilterWhereExpression
  | ModifierChildrenExpression
  | ModifierChildrenWhereExpression

export type OccurrenceExpression = {
} & B: eExpression & { $type, $count }: { $type: "occurrence", $count: Counter,
  $course: Course, }
export type OfExpression = {
} & B: eExpression & { $type, $count }: { $type: "of", $count: Counter,
  $of: Array<Expression | Fulfillment>, }
export type ReferenceExpression = {
} & B: eExpression & { $type, $requirement }: { $type: "reference", $requirement: string, }
type B: eFilterExpression = {
} & B: eExpression & { $type, $distinct }: { $type: "filter", $distinct: boolean, }
export type FilterWhereExpression = B: eFilterExpression & { $filterType, $where }: { $filterType: "where", $where: Qualifier, }
export type FilterOfExpression = B: eFilterExpression & { $filterType, $of }: { $filterType: "of", $of: Array<CourseExpression>, }
export type FilterExpression = FilterOfExpression | FilterWhereExpression

export type WhereExpression = {
} & B: eExpression & { $type, $where }: { $type: "where", $where: Qualifier,
  $count: Counter,
  $distinct: boolean, }
export type Expression =
  | BooleanExpression
  | CourseExpression
  | ModifierExpression
  | OccurrenceExpression
  | OfExpression
  | ReferenceExpression
  | FilterExpression
  | WhereExpression

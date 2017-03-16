// @flow

export type OverridesPath = string[];
export type OverridesObject = { [key: string]: any };
export type FulfillmentsPath = OverridesPath;
export type FulfillmentsObject = { [key: string]: Fulfillment };

export type AreaOfStudyTypeEnum =
    | 'degree'
    | 'major'
    | 'concentration'
    | 'emphasis'
    | 'interdisciplinary';
export type AreaOfStudy = Requirement & {
    name: string,
    type: AreaOfStudyTypeEnum,
};

export type Fulfillment = {
    $course: Course,
};

export type Filter = FilterExpression;

export type Requirement = {
    $type: 'requirement',
    result: Expression,
    filter: Filter,
    computed: boolean,
    overridden?: boolean,
    'children share courses'?: boolean,
};

export type clbidT = number;
export type crsidT = number;

export type CourseType = 'Research' | 'FLAC';

export type Course = {
    clbid: clbidT,
    credits: number,
    crsid: crsidT,
    department: string[],
    gereqs: string[],
    groupid: number,
    level: number,
    name: string,
    number: number,
    pf: boolean,
    semester: number,
    type: CourseType,
    year: number,
    _extraKeys?: string[],
};

export type CounterOperatorEnum = '$gte' | '$lte' | '$eq';
export type Counter = {
    $operator: CounterOperatorEnum,
    $num: number,
    $was?: 'all' | 'any' | 'none',
};

type Operator = '$lte' | '$lt' | '$eq' | '$gte' | '$gt' | '$ne';

type BaseExpression = {
    _fulfillment?: Fulfillment,
    _matches?: Course[],
    _matched?: Course[],
    _result?: boolean,
    _checked?: boolean,
};

// type NotExpression = BaseExpression & {$type: 'not', $not: Expression[]}
export type OrExpression = BaseExpression & {
    $type: 'boolean',
    $booleanType: 'or',
    $or: (Expression | Fulfillment)[],
};
export type AndExpression = BaseExpression & {
    $type: 'boolean',
    $booleanType: 'and',
    $and: (Expression | Fulfillment)[],
};
export type BooleanExpression = OrExpression | AndExpression;

export type CourseExpression = BaseExpression & {
    _request?: Course,
    _taken?: boolean,
    $type: 'course',
    $course: Course,
};

export type QualificationFunctionValue = {
    $type: 'function',
    $name: string,
    $prop: string,
    $where: Qualifier,
    '$computed-value': any,
};
type QualificationStaticValue = number | string;
export type QualificationBooleanOrValue = {
    $type: 'boolean',
    $booleanType: 'or',
    $or: QualificationStaticValue[],
};
export type QualificationBooleanAndValue = {
    $type: 'boolean',
    $booleanType: 'and',
    $and: QualificationStaticValue[],
};
export type QualificationBooleanValue =
    | QualificationBooleanOrValue
    | QualificationBooleanAndValue;

type QualificationValue =
    | QualificationFunctionValue
    | QualificationBooleanValue
    | QualificationStaticValue;

export type Qualification = BaseExpression & {
    $type: 'qualification',
    $key: string,
    $operator: Operator,
    $value: QualificationValue,
};

export type OrQualification = BaseExpression & {
    $type: 'boolean',
    $booleanType: 'or',
    $or: Qualifier[],
};
export type AndQualification = BaseExpression & {
    $type: 'boolean',
    $booleanType: 'and',
    $and: Qualifier[],
};
export type BooleanQualification = OrQualification | AndQualification;
export type Qualifier = BooleanQualification | Qualification;

type ModifierWhatEnum = 'course' | 'credit' | 'department';
type BaseModifierExpression = {
    _fulfillment?: Fulfillment,
    _matches?: Course[],
    _matched?: Course[],
    _result?: boolean,
    _checked?: boolean,
    $type: 'modifier',
    $count: Counter,
    $what: ModifierWhatEnum,
    $besides?: CourseExpression,
};
export type ModifierFilterExpression = BaseModifierExpression & {
    $from: 'filter',
};
export type ModifierFilterWhereExpression = BaseModifierExpression & {
    $from: 'filter-where',
    $where: Qualifier,
};
export type ModifierChildrenExpression = BaseModifierExpression & {
    $from: 'children',
    $children: '$all' | ReferenceExpression[],
};
export type ModifierChildrenWhereExpression = BaseModifierExpression & {
    $from: 'children-where',
    $children: '$all' | ReferenceExpression[],
    $where: Qualifier,
};
export type ModifierWhereExpression = BaseModifierExpression & {
    $from: 'where',
    $where: Qualifier,
};
export type ModifierExpression =
    | ModifierWhereExpression
    | ModifierFilterExpression
    | ModifierFilterWhereExpression
    | ModifierChildrenExpression
    | ModifierChildrenWhereExpression;

export type OccurrenceExpression = BaseExpression & {
    $type: 'occurrence',
    $count: Counter,
    $course: Course,
};

export type OfExpression = BaseExpression & {
    $type: 'of',
    $count: Counter,
    $of: (Expression | Fulfillment)[],
};

export type ReferenceExpression = BaseExpression & {
    $type: 'reference',
    $requirement: string,
};

type BaseFilterExpression = BaseExpression & {
    $type: 'filter',
    $distinct: boolean,
};
export type FilterWhereExpression = BaseFilterExpression & {
    $filterType: 'where',
    $where: Qualifier,
};
export type FilterOfExpression = BaseFilterExpression & {
    $filterType: 'of',
    $of: Expression,
};
export type FilterExpression = FilterOfExpression | FilterWhereExpression;

export type WhereExpression = BaseExpression & {
    $type: 'where',
    $where: Qualifier,
    $count: Counter,
    $distinct: boolean,
};

export type Expression =
    | BooleanExpression
    | CourseExpression
    | ModifierExpression
    | OccurrenceExpression
    | OfExpression
    | ReferenceExpression
    | FilterExpression
    | WhereExpression;

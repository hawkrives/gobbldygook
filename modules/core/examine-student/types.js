// @flow

export type OverridesPath = string[]
export type OverridesObject = {[key: string]: any}
export type FulfillmentsPath = OverridesPath
export type FulfillmentsObject = OverridesObject

export type AreaOfStudy = Requirement & {
	name: string,
	type: 'degree'|'major'|'concentration'|'emphasis',
}

export type Fulfillment = { }

export type Filter = FilterExpression

export type Requirement = {
	$type: 'requirement',
	result: Expression,
	filter: Filter,
	computed: boolean,
	overridden?: boolean,
	'children share courses'?: boolean,
}

export type clbidT = number
export type crsidT = number

export type CourseType = 'Research'|'FLAC'

export type Course = {
	clbid: number,
	credits: number,
	crsid: number,
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
}

export type Counter = {
	$operator: '$gte'|'$lte'|'$eq',
	$num: number,
	$was?: 'all'|'any'|'none',
}

type Operator = '$lte'|'$lt'|'$eq'|'$gte'|'$gt'|'$ne'

// type NotExpression = BaseExpression & {$type: 'not', $not: Expression[]}
type BaseBooleanExpression = {$type: 'boolean'}
type AndExpression = BaseBooleanExpression & {$and: Expression[]}
type OrExpression = BaseBooleanExpression & {$or: Expression[]}
type BooleanExpression = AndExpression | OrExpression

export type CourseExpression = {
	$type: 'course',
	$course: {
		department: string[],
		number: number,
		international?: boolean,
		type?: 'Lab',
		section: string,
		year: number,
		semester: 1|2|3|4|5,
	}
}

let sample: QualifierExpression = {
	$type: 'qualification',
	$key: 'number',
	$operator: '$gte',
	$value: {
		$type: 'function',
		$name: 'max',
		$prop: 'number',
	},
}

type QualificationFunctionValue = {
	$type: 'function',
	$name: string,
	$prop: string,
}
type QualificationStaticValue = number|string
type QualificationListValue = {$type: 'boolean'}
	& (
		{$or: QualificationStaticValue[]} |
		{$and: QualificationStaticValue[]}
	)

type QualificationValue = QualificationFunctionValue | QualificationStaticValue | QualificationListValue | CoreQualifierExpression

type CoreQualifierExpression = {
	$key: string,
	$operator: Operator,
	$value: QualificationValue,
	_computed_value?: any,
}
export type QualifierExpression = ({$type: 'qualification'} & CoreQualifierExpression) | BooleanExpression


type ModifierFilterExpression = {
	$from: 'filter',
}
type ModifierFilterWhereExpression = {
	$from: 'filter-where',
	$where: QualifierExpression,
}
type ModifierChildrenExpression = {
	$from: 'children',
	$children: '$all' | ReferenceExpression[],
}
type ModifierChildrenWhereExpression = {
	$from: 'children-where',
	$children: '$all' | ReferenceExpression[],
	$where: QualifierExpression,
}
type ModifierWhereExpression = {
	$from: 'where',
	$where: QualifierExpression,
}
type ModifiedModifierExpression =
	ModifierWhereExpression |
	ModifierFilterExpression |
	ModifierFilterWhereExpression |
	ModifierChildrenExpression |
	ModifierChildrenWhereExpression

type ModifierExpression = ModifiedModifierExpression & {
	$type: 'modifier',
	$count: Counter,
	$what: 'course'|'credit'|'department',
	$besides: CourseExpression,
}

type OccurrenceExpression = {
	$type: 'occurrence',
	$count: Counter,
	$course: CourseExpression,
}

type OfExpression = {
	$type: 'of',
	$count: Counter,
	$of: Expression[],
}

type ReferenceExpression = {
	$type: 'reference',
	$requirement: string,
}

type FilterWhereExpression = {
	$where: QualifierExpression,
}
type FilterOfExpression = {
	$of: Expression,
}
type FilterExpression = (FilterOfExpression | FilterWhereExpression) & {
	$type: 'filter',
	$distinct: boolean,
}

type WhereExpression = {
	$type: 'where',
	$where: QualifierExpression,
	$count: Counter,
	$distinct: boolean,
}

export type Expression = BooleanExpression
	| CourseExpression
	| ModifierExpression
	| OccurrenceExpression
	| OfExpression
	| ReferenceExpression
	| FilterExpression
	| WhereExpression

export type EvaluatedExpression = Expression & {
	_matches: Course[],
	_result: boolean,
}

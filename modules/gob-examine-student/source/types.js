// @flow

export type OverridesPath = string[]
export type OverridesObject = {[key: string]: any}
export type FulfillmentsPath = OverridesPath
export type FulfillmentsObject = {[key: string]: Fulfillment}

export type AreaOfStudyTypeEnum =
	| 'degree'
	| 'major'
	| 'concentration'
	| 'emphasis'
	| 'interdisciplinary'

export type AreaOfStudy = {
	...Requirement,
	name: string,
	type: AreaOfStudyTypeEnum,
}

export type Fulfillment = {
	$course: Course,
}

export type Filter = FilterExpression

export type Requirement = {
	$type: 'requirement',
	result: Expression,
	filter: Filter,
	computed: boolean,
	overridden?: boolean,
	'children share courses'?: boolean,
}

// {
// 	"comments": [],
// 	"credits": 6.0,
// 	"department": "AFST",
// 	"id": "AFST 112.00",
// 	"instructors": ["Charisse E Burden-Stelly"],
// 	"number": "112",
// 	"offerings": {
// 		"locations": ["Leighton 426"],
// 		"times": [
// 			{"day": "Tu", "end": "4:55pm", "start": "3:10pm"},
// 			{"day": "Th", "end": "4:55pm", "start": "3:10pm"}
// 		]
// 	},
// 	"prerequisites": null,
// 	"requirements": ["SI", "WR2", "IDS"],
// 	"scnc": null,
// 	"section": "00",
// 	"semester": "FA",
// 	"size": {"registered": 24, "total": 30, "waitlist": 0},
// 	"status": "Open",
// 	"summary": null,
// 	"synonym": "49138",
// 	"tags": ["AFSTSI", "POSI-PLI2", "AMSTREI", "AFSTCORE"],
// 	"title": "Black Revolution on Campus",
// 	"type": "Course"
// 	"year": 2000
// }

export opaque type clbidT = number
export opaque type crsidT = number

export type CourseType = 'Course' | 'Lab' | 'Juried' | 'FLAC' | 'St. Olaf'

export type Course = {
	id: string,
	comments: Array<string>,
	credits: number,
	instructor: Array<string>,
	number: string,
	offerings: {
		locations: Array<string>,
		times: Array<{day: string, start: string, end: string}>,
	},
	prerequisites: null | string,
	requirements: Array<string>,
	scnc: null | true,
	section: string,
	semester: string,
	size: {registered: number, total: number, waitlist: number},
	status: null | "Open" | "Closed",
	subject: string,
	summary: null | string,
	synonym: string,
	tags: Array<string>,
	title: string,
	type: CourseType,
	year: number,
	_extraKeys?: Array<string>,
}

export type CounterOperatorEnum = '$gte' | '$lte' | '$eq'
export type Counter = {
	$operator: CounterOperatorEnum,
	$num: number,
	$was?: 'all' | 'any' | 'none',
}

type Operator = '$lte' | '$lt' | '$eq' | '$gte' | '$gt' | '$ne'

type BaseExpression = {
	_fulfillment?: Fulfillment,
	_matches?: Array<Course>,
	_matched?: Array<Course>,
	_result?: boolean,
	_checked?: boolean,
	_counted?: number,
}

// type NotExpression = BaseExpression & {$type: 'not', $not: Expression[]}
export type OrExpression = {
	...BaseExpression,
	$type: 'boolean',
	$booleanType: 'or',
	$or: Array<Expression | Fulfillment>,
}
export type AndExpression = {
	...BaseExpression,
	$type: 'boolean',
	$booleanType: 'and',
	$and: Array<Expression | Fulfillment>,
}
export type BooleanExpression = OrExpression | AndExpression

export type CourseExpression = {
	...BaseExpression,
	_request?: Course,
	_taken?: boolean,
	$type: 'course',
	$course: Course,
}

export type QualificationFunctionValue = {
	$type: 'function',
	$name: string,
	$prop: string,
	$where: Qualifier,
	'$computed-value': any,
}
type QualificationStaticValue = number | string
export type QualificationBooleanOrValue = {
	$type: 'boolean',
	$booleanType: 'or',
	$or: Array<QualificationStaticValue>,
}
export type QualificationBooleanAndValue = {
	$type: 'boolean',
	$booleanType: 'and',
	$and: Array<QualificationStaticValue>,
}
export type QualificationBooleanValue =
	| QualificationBooleanOrValue
	| QualificationBooleanAndValue

type QualificationValue =
	| QualificationFunctionValue
	| QualificationBooleanValue
	| QualificationStaticValue

export type Qualification = {
	...BaseExpression,
	$type: 'qualification',
	$key: string,
	$operator: Operator,
	$value: QualificationValue,
}

export type OrQualification = {
	...BaseExpression,
	$type: 'boolean',
	$booleanType: 'or',
	$or: Array<Qualifier>,
}
export type AndQualification = {
	...BaseExpression,
	$type: 'boolean',
	$booleanType: 'and',
	$and: Array<Qualifier>,
}
export type BooleanQualification = OrQualification | AndQualification
export type Qualifier = BooleanQualification | Qualification

type ModifierWhatEnum = 'course' | 'credit' | 'department' | 'term'
type BaseModifierExpression = {
	_fulfillment?: Fulfillment,
	_matches?: Array<Course>,
	_matched?: Array<Course>,
	_result?: boolean,
	_checked?: boolean,
	_counted?: number,
	$type: 'modifier',
	$count: Counter,
	$what: ModifierWhatEnum,
	$besides?: CourseExpression,
}
export type ModifierFilterExpression = {
	...BaseModifierExpression,
	$from: 'filter',
}
export type ModifierFilterWhereExpression = {
	...BaseModifierExpression,
	$from: 'filter-where',
	$where: Qualifier,
}
export type ModifierChildrenExpression = {
	...BaseModifierExpression,
	$from: 'children',
	$children: '$all' | Array<ReferenceExpression>,
}
export type ModifierChildrenWhereExpression = {
	...BaseModifierExpression,
	$from: 'children-where',
	$children: '$all' | Array<ReferenceExpression>,
	$where: Qualifier,
}
export type ModifierWhereExpression = {
	...BaseModifierExpression,
	$from: 'where',
	$where: Qualifier,
}
export type ModifierExpression =
	| ModifierWhereExpression
	| ModifierFilterExpression
	| ModifierFilterWhereExpression
	| ModifierChildrenExpression
	| ModifierChildrenWhereExpression

export type OccurrenceExpression = {
	...BaseExpression,
	$type: 'occurrence',
	$count: Counter,
	$course: Course,
}

export type OfExpression = {
	...BaseExpression,
	$type: 'of',
	$count: Counter,
	$of: Array<Expression | Fulfillment>,
}

export type ReferenceExpression = {
	...BaseExpression,
	$type: 'reference',
	$requirement: string,
}

type BaseFilterExpression = {
	...BaseExpression,
	$type: 'filter',
	$distinct: boolean,
}
export type FilterWhereExpression = {
	...BaseFilterExpression,
	$filterType: 'where',
	$where: Qualifier,
}
export type FilterOfExpression = {
	...BaseFilterExpression,
	$filterType: 'of',
	$of: Array<Course>,
}
export type FilterExpression = FilterOfExpression | FilterWhereExpression

export type WhereExpression = {
	...BaseExpression,
	$type: 'where',
	$where: Qualifier,
	$count: Counter,
	$distinct: boolean,
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

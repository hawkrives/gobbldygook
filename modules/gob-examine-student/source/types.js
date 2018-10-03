// @flow

import type {Course} from '@gob/types'
export type {Course}

import type {
	ParsedHansonFile,
	ParsedHansonRequirement,
} from '@gob/hanson-format'
export type {ParsedHansonFile, ParsedHansonRequirement}

export type ComputationResult = {
	computed: boolean,
	details: ?Requirement,
	overridden?: true,
	error?: string,
}

export type EvaluationResult = {
	computed: boolean,
	details: ?Requirement,
	overridden?: true,
	error?: string,
	progress: {
		of: number,
		at: number,
	},
}

export type OverridesPath = string[]
export type OverridesObject = {[key: string]: any}
export type FulfillmentsPath = OverridesPath
export type FulfillmentsObject = {[key: string]: Fulfillment}

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

export type QualificationValue =
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

type ModifierWhatEnum = 'course' | 'credit' | 'department'
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
	$where: Qualification,
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

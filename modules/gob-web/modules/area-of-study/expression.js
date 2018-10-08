// @flow

import * as React from 'react'
import cx from 'classnames'
import CourseExpression from './expression--course'
import ResultIndicator from './result-indicator'
import type {
	Qualifier,
	Qualification,
	QualificationValue,
} from '@gob/examine-student'
import plur from 'plur'
import {humanizeOperator} from '@gob/examine-student'

import type {Course} from '@gob/types'

import './expression.scss'

const JOINERS = {
	$and: 'AND',
	$or: 'OR',
	$invalid: 'INVALID',
}

function makeBooleanExpression({expr, ctx}) {
	let kind = '$invalid'

	if ('$and' in expr) {
		kind = '$and'
	} else if ('$or' in expr) {
		kind = '$or'
	}

	const contents = expr[kind].reduce((acc, exp, i) => {
		if (i > 0) {
			acc.push(
				<span key={`${i}-joiner`} className="joiner">
					{JOINERS[kind]}
				</span>,
			)
		}

		acc.push(<Expression key={i} expr={exp} ctx={ctx} />)

		return acc
	}, [])

	return {contents}
}

const ofLookup = {
	all: 'All of',
	any: 'Any of',
	none: 'None of',
}

function makeOfExpression({expr, ctx}) {
	const description = expr.$count.$was
		? ofLookup[expr.$count.$was] || '???'
		: `${expr._counted || 0} of ${humanizeOperator(
				expr.$count.$operator,
		  )} ${expr.$count.$num} from among`

	const contents = expr.$of.map((ex, i) => (
		<Expression key={i} expr={ex} ctx={ctx} />
	))

	return {description, contents}
}

function makeModifierExpression({expr}) {
	const op = humanizeOperator(expr.$count.$operator)
	const num = expr.$count.$num
	const needs = `${op} ${num} ${plur(expr.$what, expr.$count.$num)}`
	let from = expr.$from
	if (expr.$from === 'where') {
		from = 'courses where ' + makeWhereQualifier(expr.$where)
	}
	const description = `${expr._counted || 0} of ${needs} from ${from}`
	return {description}
}

let operators = {
	$lte: '<=',
	$gte: '>=',
	$eq: 'is',
	$ne: '!=',
	$gt: '>',
	$lt: '<',
	other: '?',
}
let keys = {
	gereqs: 'G.E.',
}

function stringifyWhereValue(value: QualificationValue): string {
	if (typeof value === 'number') {
		return String(value)
	}

	if (typeof value === 'string') {
		return value
	}

	if (value.$type === 'function') {
		return value['$computed-value']
	}

	if (value.$type === 'boolean') {
		if (value.$booleanType === 'or') {
			return value.$or.join(' OR ')
		} else if (value.$booleanType === 'and') {
			return value.$and.join(' AND ')
		}
	}

	return 'Unknown'
}

export function makeWhereQualifier(where: Qualifier | Qualification): string {
	if (where.$type === 'boolean') {
		if (where.$booleanType === 'and') {
			return where.$and.map(makeWhereQualifier).join(' AND ')
		} else if (where.$booleanType === 'or') {
			return where.$or.map(makeWhereQualifier).join(' OR ')
		}
	}

	if (where.$type !== 'qualification') {
		return 'unknown'
	}

	let operator = operators[where.$operator || 'other']
	let key = keys[where.$key] || where.$key
	let value = stringifyWhereValue(where.$value)
	return `${key} ${operator} ${value}`
}

function makeWhereExpression({expr}) {
	const op = humanizeOperator(expr.$count.$operator)
	const num = expr.$count.$num
	const needs = `${op} ${num}`
	const qualifier = makeWhereQualifier(expr.$where)
	const distinct = expr.$distinct ? 'distinct ' : ''
	const word = expr.$count.$num === 1 ? 'course' : 'courses'
	const counted = expr._counted || 0
	const description = `${counted} of ${needs} ${distinct}${word} from courses where ${qualifier}`

	let matches = expr._matches || []
	let contents: ?Array<React.Node> = matches.map((course: Course, i) => (
		<Expression
			key={i}
			expr={{$type: 'course', $course: course}}
			hideIndicator={true}
		/>
	))

	if (contents && !contents.length) {
		contents = null
	}

	return {description, contents}
}

function makeOccurrenceExpression({expr}) {
	const op = humanizeOperator(expr.$count.$operator)
	const word = expr.$count.$num === 1 ? 'occurrence' : 'occurrences'
	const num = expr.$count.$num
	const description = `${expr._counted || 0} of ${op} ${num} ${word} of `

	const contents = <Expression expr={{...expr, type: 'course'}} />

	return {description, contents}
}

export type Props = {
	// $FlowFixMe TODO rives
	expr: any,
	hideIndicator?: boolean,
	ctx?: mixed,
}

export default function Expression(props: Props) {
	const {expr} = props
	const {$type} = expr

	if (!$type) {
		return null
	}

	const computationResult = expr._result
	const isFulfillment = expr._isFulfillment
	const wasUsed = Boolean(expr._result)
	const wasTaken = expr._taken
	const wasEvaluated = expr._checked

	let contents = null
	let description = null
	let result = null

	if ($type === 'boolean') {
		;({contents} = makeBooleanExpression(props))
	} else if ($type === 'course') {
		// _request is the original course that was written in the spec.
		// $course is the matched course. It's used mostly by where-expressions and the like.
		contents = (
			<CourseExpression
				{...expr._request || expr.$course}
				_taken={expr._taken}
			/>
		)
		result = <ResultIndicator result={wasTaken} />
	} else if ($type === 'reference') {
		contents = expr.$requirement
		result = <ResultIndicator result={computationResult} />
	} else if ($type === 'of') {
		;({contents, description} = makeOfExpression(props))
	} else if ($type === 'modifier') {
		;({description} = makeModifierExpression(props))
		result = <ResultIndicator result={computationResult} />
	} else if ($type === 'where') {
		;({description, contents} = makeWhereExpression(props))
	} else if ($type === 'occurrence') {
		;({description, contents} = makeOccurrenceExpression(props))
	} else {
		console.warn(`<Expression />: type not handled: ${$type}`, props)
		contents = JSON.stringify(expr, null, 2)
	}

	const className = cx([
		'expression',
		`expression--${$type}`,
		wasEvaluated ? 'evaluated' : 'not-evaluated',
		isFulfillment ? 'fulfillment' : '',
		wasTaken ? 'taken' : 'not-taken',
		wasUsed ? 'used' : 'not-used',
	])

	return (
		<span className={className}>
			{description && (
				<span className="expression--description">
					{description}
					{!props.hideIndicator && result}
				</span>
			)}
			{contents && (
				<span className="expression--contents">
					{typeof contents === 'string' ? (
						<span className="expression--label">{contents}</span>
					) : (
						contents
					)}
					{props.hideIndicator || expr._isFulfillment ? null : result}
				</span>
			)}
		</span>
	)
}

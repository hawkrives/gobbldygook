import React, {PropTypes} from 'react'

import CourseExpression from './expression--course'
import ResultIndicator from './result-indicator'

import map from 'lodash/collection/map'
import orderBy from 'lodash/collection/orderBy'
import cx from 'classnames'
import plur from 'plur'
import humanizeOperator from '../../../area-tools/humanize-operator'

import './expression.scss'

const joiners = {
	$and: 'AND',
	$or: 'OR',
}

function makeBooleanExpression({expr, ctx}) {
	let kind = '$invalid'

	if ('$and' in expr) {
		kind = '$and'
	}
	else if ('$or' in expr) {
		kind = '$or'
	}

	const contents = expr[kind].reduce((acc, exp, i) => {
		if (i > 0) {
			acc.push(<span key={`${i}-joiner`} className='joiner'>{joiners[kind]}</span>)
		}

		acc.push(<Expression key={i} expr={exp} ctx={ctx} />)

		return acc
	}, [])

	return {contents}
}

const ofLookup = {
	all: `All of`,
	any: `Any of`,
	none: `None of`,
}

function makeOfExpression({expr, ctx}) {
	const description = ofLookup[expr.$count.$was] || `${expr._counted || 0} of ${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num} from among`

	const contents = map(orderBy(expr.$of, ['_result'], ['desc']), (ex, i) =>
		<Expression key={i} expr={ex} ctx={ctx} />)

	return {description, contents}
}

function makeModifierExpression({expr}) {
	const needs = `${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num} ${plur(expr.$what, expr.$count.$num)}`
	const description = `${expr._counted} of ${needs} from ${expr.$from}`

	return {description}
}

function makeWhereQualifier(where) {
	return `${where.$key} ${where.$operator} ${where.$value}`
}

function makeWhereExpression({expr}) {
	// console.log(expr)
	const needs = `${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num}`
	const qualifier = makeWhereQualifier(expr.$where)
	const description = `${expr._counted} of ${needs} from ${qualifier}`

	let contents = map(expr._matches, (course, i) =>
		<Expression key={i} expr={{$type: 'course', $course: course}} hideIndicator={true} />)

	if (!contents.length) {
		contents = null
	}

	return {description, contents}
}

function makeOccurrenceExpression({expr}) {
	const description = `${expr._counted} of ${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num} ${plur('occurrence', expr.$count.$num)} of `

	const contents = <Expression expr={{...expr, type: 'course'}} />

	return {description, contents}
}

export default function Expression(props) {
	const {expr} = props
	const {$type} = expr

	if (!$type) {
		return null
	}

	const wasComputed = expr.hasOwnProperty('_result')
	const computationResult = expr._result

	let contents = null
	let description = null
	let result = null

	if ($type === 'boolean') {
		({contents} = makeBooleanExpression({...props}))
	}

	else if ($type === 'course') {
		contents = <CourseExpression {...expr.$course} />
		result = <ResultIndicator result={computationResult}  />
	}

	else if ($type === 'reference') {
		contents = expr.$requirement
		result = <ResultIndicator result={computationResult}  />
	}

	else if ($type === 'of') {
		({contents, description} = makeOfExpression({...props}))
	}

	else if ($type === 'modifier') {
		({description} = makeModifierExpression({...props}))
		result = <ResultIndicator result={computationResult}  />
	}

	else if ($type === 'where') {
		({description, contents} = makeWhereExpression({...props}))
	}

	else if ($type === 'occurrence') {
		({description, contents} = makeOccurrenceExpression({...props}))
	}

	else {
		console.warn(`<Expression />: type not handled: ${$type}`)
		console.log(props)
		contents = JSON.stringify(expr, null, 2)
	}

	const className = cx(
		'expression',
		`expression--${$type}`,
		wasComputed ? 'computed' : 'computed--not',
		computationResult ? 'computed-success' : 'computed-failure')

	return (
		<span className={className}>
			{description &&
				<span className='expression--description'>
					{description}{!props.hideIndicator && result}
				</span>}
			{contents &&
				<span className='expression--contents'>
					{contents}
					{!props.hideIndicator && result}
				</span>}
		</span>
	)
}

Expression.propTypes = {
	ctx: PropTypes.object,
	expr: PropTypes.shape({
		$type: PropTypes.string,
	}).isRequired,
	hideIndicator: PropTypes.bool,
}

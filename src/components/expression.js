import React, {Component, PropTypes} from 'react'

import CourseExpression from './expression--course'
import ResultIndicator from './result-indicator'

import cx from 'classnames'
import plur from 'plur'
import humanizeOperator from '../lib/humanize-operator'

import './expression.scss'

const joiners = {
	$and: 'AND',
	$or: 'OR',
}

function makeBooleanExpression({expr, ctx}) {
	let kind = '$invalid'

	if (expr.hasOwnProperty('$and')) {
		kind = '$and'
	}

	else if (expr.hasOwnProperty('$or')) {
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

	const contents = expr.$of.map((ex, i) =>
				<Expression key={i} expr={ex} ctx={ctx} />)

	return {description, contents}
}

function makeModifierExpression({expr}) {
	const description = `${expr._counted} of ${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num} ${plur(expr.$what, expr.$count.$num)} from ${expr.$from}`

	return {description}
}

function makeWhereExpression({expr}) {
	console.log(expr)
	const description = `${expr._counted} of ${humanizeOperator(expr.$count.$operator)} ${expr.$count.$num} from ${expr.$where.$key} ${expr.$where.$operator} ${expr.$where.$value}`

	return {description}
}

export default class Expression extends Component {
	static propTypes = {
		ctx: PropTypes.object.isRequired,
		expr: PropTypes.shape({
			$type: PropTypes.string,
		}).isRequired,
	}

	render() {
		const {expr} = this.props
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
			({contents} = makeBooleanExpression({...this.props}))
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
			({contents, description} = makeOfExpression({...this.props}))
		}

		else if ($type === 'modifier') {
			({description} = makeModifierExpression({...this.props}))
			result = <ResultIndicator result={computationResult}  />
		}

		else if ($type === 'where') {
			({description} = makeWhereExpression({...this.props}))
		}

		else {
			console.warn(`<Expression />: type not handled: ${$type}`)
			console.log(this.props)
			contents = JSON.stringify(expr)
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
						{description}
						{result}
					</span>
				}
				{contents &&
					<span className='expression--contents'>
						{contents}
						{result}
					</span>
				}
			</span>
		)
	}
}

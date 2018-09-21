// @flow

import React from 'react'
import Expression, {makeWhereQualifier} from './expression'

import type {OfExpression, WhereExpression} from '@gob/examine-student'
import type {Props} from './expression'

function FilterOf({expr, ctx}: {expr: OfExpression, ctx: mixed}) {
	return (
		<div>
			{expr.$of.map((ex, i) => (
				<Expression key={i} expr={ex} ctx={ctx} />
			))}
		</div>
	)
}

function FilterWhere({expr}: {expr: WhereExpression}) {
	const qualifier = makeWhereQualifier(expr.$where)
	const description = `only courses where ${qualifier}`

	return (
		<div>
			<p>{description}</p>
		</div>
	)
}

export default function Filter(props: Props) {
	if (!props.expr.$type) {
		return null
	}

	if (props.expr.$type === 'of') {
		return <FilterOf {...props} />
	} else if (props.expr.$type === 'where') {
		return <FilterWhere {...props} />
	} else {
		return <div>{JSON.stringify(props, null, 2)}</div>
	}
}

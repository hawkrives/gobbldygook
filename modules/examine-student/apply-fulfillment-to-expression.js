// @flow
import type { OrExpression, Expression, Fulfillment } from './types'

export default function applyFulfillmentToExpression(expr: Expression, fulfillment: Fulfillment): Expression {
	// If it's a Boolean / course expr, it gets wrapped in an OR.
	// Otherwise, we don't do anything at this stage.
	if (expr.$type === 'boolean' && expr.$booleanType === 'or') {
		expr._fulfillment = fulfillment
		expr.$or.push(fulfillment)
	}
	else if ((expr.$type === 'boolean' && expr.$booleanType === 'and') || expr.$type === 'course') {
		// example OR-expression:
		// { $type: "boolean", $or: [{...}, {...}] }
		let wrapper: OrExpression = { $type: 'boolean', $booleanType: 'or', $or: [expr, fulfillment] }
		wrapper._fulfillment = fulfillment
		return wrapper
	}
	return expr
}

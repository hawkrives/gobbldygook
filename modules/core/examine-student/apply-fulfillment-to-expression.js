export default function applyFulfillmentToExpression(expr, fulfillment) {
	// If it's a Boolean / course expr, it gets wrapped in an OR.
	// Otherwise, we don't do anything at this stage.
	if (expr.$type === 'boolean' && expr.$or) {
		expr._fulfillment = fulfillment
		expr.$or.push(fulfillment)
	}
	else if (expr.$and || expr.$type === 'course') {
		// example OR-expression:
		// { $type: "boolean", $or: [{...}, {...}] }
		expr = {$type: 'boolean', $or: [expr, fulfillment]}
		expr._fulfillment = fulfillment
	}
	return expr
}

import mapValues from 'lodash/mapValues'
import isRequirementName from './is-requirement-name'
import applyFilter from './apply-filter'
import computeChunk from './compute-chunk'
import hasOverride from './has-override'
import getOverride from './get-override'

import pathToOverride from './path-to-override'
function getFulfillment(path, fulfillments) {
	return fulfillments[pathToOverride(path)] || null
}

function applyFulfillmentToExpression(expr, fulfillment) {
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

// The overall computation is done by compute, which is in charge of computing
// sub-requirements and such.

export default function compute(requirement, {path, courses=[], overrides={}, fulfillments={}, dirty=new Set()}) {
	requirement = mapValues(requirement, (req, name) => {
		if (isRequirementName(name)) {
			return compute(req, {path: path.concat([name]), courses, overrides, dirty, fulfillments})
		}
		return req
	})

	let computed = false

	// Apply a filter to the set of courses
	if ('filter' in requirement) {
		courses = applyFilter(requirement.filter, courses)
	}

	// Now check for results
	if ('result' in requirement) {
		if (requirement.result === '') {
			throw new SyntaxError(`compute(): requirement.result must not be empty (in ${JSON.stringify(requirement)})`)
		}

		let fulfillment = getFulfillment(path, fulfillments)
		if (fulfillment) {
			requirement.result = applyFulfillmentToExpression(requirement.result, fulfillment)
		}

		computed = computeChunk({expr: requirement.result, ctx: requirement, courses, dirty, fulfillment})
	}

	// or ask for an override
	else if ('message' in requirement) {
		computed = false
	}

	// or throw an error
	else {
		throw new TypeError('compute(): either `message` or `result` is required')
	}

	requirement.computed = computed

	if (hasOverride(path, overrides)) {
		requirement.overridden = true
		requirement.computed = getOverride(path, overrides)
	}

	return requirement
}

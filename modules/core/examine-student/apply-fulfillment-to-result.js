// @flow
import computeCountWithOperator from './compute-count-with-operator'

export default function applyFulfillmentToResult({fulfillment, expr, computedResult, matches, counted}) {
	let needsFulfillment = true

	if (expr.$type === 'boolean' || expr.$type === 'course') {
		return {computedResult, matches, counted}
	}

	let counter = expr.$count
	if (counter && (counter.$operator === '$lte' || counter.$operator === '$eq')) {
		if (expr.$type === 'of' && counter.$was === 'all') {
			// if we have a query that used to be 'all of', then we still need it to be 'all of'?
			// TODO: um... actually, we might not want this. we'll have to see.
			counter.$num += 1
			needsFulfillment = true
		}
		else if (computedResult === true) {
			// if we already have enough matches in an 'at-most' query, don't
			// add another one
			needsFulfillment = false
		}
	}

	// this feels like it'll be a bit wierd around checking modifiers with departments and credits…
	if (needsFulfillment) {
		if (expr.$type === 'of') {
			expr.$of.push(fulfillment)
		}

		matches.push(fulfillment.$course)
		counted += 1

		computedResult = computeCountWithOperator({
			comparator: counter.$operator,
			has: counted,
			needs: counter.$num,
		})
	}

	return {computedResult, matches, counted}
}

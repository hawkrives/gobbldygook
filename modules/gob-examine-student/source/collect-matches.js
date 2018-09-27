// @flow
import assertKeys from './assert-keys'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
import stringify from 'stabilize'
import type {Expression, Requirement, Course} from './types'

export default collectMatches

// Collects matched courses from a result object
function collectMatches(expr: Expression | Requirement): Array<Course> {
	let matches = justCollectMatches(expr)

	// we either return the matches, or an empty array if it's falsy
	return matches ? uniqBy(matches, stringify) : []
}

function justCollectMatches(expr: Expression | Requirement): ?Array<Course> {
	assertKeys(expr, '$type')

	// if a course expression, and the course was used, return the course in
	// an array. returning in an array allows the higher-level expressions to
	// just run `flatten()` to collect all of the courses.

	switch (expr.$type) {
		// this is the "base case."
		case 'course': {
			/* istanbul ignore else: doesn't matter */
			if (expr._result === true) {
				return [expr]
			}

			return null
		}

		// next, we have the "run collectMatches on all my children" cases.
		case 'requirement': {
			if ('result' in expr) {
				return collectMatches(expr.result)
			}

			return null
		}
		case 'boolean': {
			if (expr.$booleanType === 'and') {
				return flatMap(expr.$and, collectMatches)
			}

			if (expr.$booleanType === 'or') {
				return flatMap(expr.$or, collectMatches)
			}

			return null
		}
		case 'of': {
			return flatMap(expr.$of, collectMatches)
		}

		// next, we have the "pre-computed _matches" cases, where the evaluation
		// of the expression attached the matches to the expression itself.
		case 'modifier': {
			return expr._matches
		}
		case 'occurrence': {
			return expr._matches
		}
		case 'reference': {
			return expr._matches
		}
		case 'where': {
			return expr._matches
		}

		// finally, we have the "i have no idea what you are" cases
		case 'filter': {
			throw new TypeError(
				'collectMatches(): unknown expression type "filter"',
			)
		}
		case undefined: {
			throw new TypeError('collectMatches(): undefined expression type')
		}
		default: {
			;(expr.$type: empty)
			throw new TypeError(
				`collectMatches(): unknown expression type "${expr.$type}"`,
			)
		}
	}
}

// @flow
import assertKeys from './assert-keys'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
import stringify from 'stabilize'
import type { Expression, Course } from './types'

/**
 * Collects matched courses from a result object
 * @private
 * @param {Result} expr - the result object to extract matches from
 * @returns {Course[]} matches - the list of matched courses
 */
export default function collectMatches(expr: Expression): Course[] {
	assertKeys(expr, '$type')

	// start off with absolutely no matches
	let matches = undefined

	// if a course expression, and the course was used, return the course in
	// an array. returning in an array allows the higher-level expressions to
	// just run `flatten()` to collect all of the courses.
	// this is the "base case."
	if (expr.$type === 'course') {
		/* istanbul ignore else: doesn't matter */
		if (expr._result === true) {
			matches = [ expr.$course || expr ]
		}
	}

	// next, we have the "run collectMatches on all my children" cases.
	else if (expr.$type === 'requirement') {
		if ('result' in expr) {
			matches = collectMatches(expr.result)
		}
		else {
			matches = []
		}
	}
	else if (expr.$type === 'boolean') {
		if (expr.$booleanType === 'and') {
			matches = flatMap(expr.$and, collectMatches)
		}
		else {
			matches = flatMap(expr.$or, collectMatches)
		}
	}
	else if (expr.$type === 'of') {
		matches = flatMap(expr.$of, collectMatches)
	}

	// finally, we have the "pre-computed _matches" cases, where the evaluation
	// of the expression attached the matches to the expression itself.
	else if (expr.$type === 'modifier') {
		matches = expr._matches
	}
	else if (expr.$type === 'occurrence') {
		matches = expr._matches
	}
	else if (expr.$type === 'reference') {
		matches = expr._matches
	}
	else if (expr.$type === 'where') {
		matches = expr._matches
	}
	else {
		throw new TypeError(`collectMatches(): unknown expression type "${expr.$type}"`)
	}

	// then we either return the matches, or an empty array if it's falsy
	return matches ? uniqBy(matches, stringify) : []
}

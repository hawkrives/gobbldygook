// @flow
import {isEqualWith} from 'lodash'
import {every} from 'lodash'
import {keys} from 'lodash'
import {filter} from 'lodash'
import {includes} from 'lodash'
import type {Course, CourseExpression} from './types'

const baseKeys = [
	'department',
	'international',
	'level',
	'number',
	'section',
	'semester',
	'type',
	'year',
]

/**
 * Used as a customizer for `isEqualWith`; checks if the left-side is a wildcard,
 * and returns as appropriate. `isEqualWith` falls back to the default comparison
 * if the customizer returns `undefined`, so we take advantage of that here.
 *
 * @private
 * @param {any} lhs - left-hand side of the comparison. rhs doesn't matter.
 * @returns {boolean} - if lhs was a wildcard
 */
function wildcard(lhs) {
	if (lhs === '*') {
		return true
	}
}

/**
 * Compares two courses.
 * @private
 * @param {Course} query - the course to compare
 * @param {Course} other - the course to compare against
 * @returns {boolean} - if the course matched
 */
export default function compareCourseToCourse(query: CourseExpression | Course, other: CourseExpression | Course) {
	// TODO: Remove the need to cast as `any` here
	query = (query: any).$course || query
	other = (other: any).$course || other

	// If the query is more specific than the one being compared to, and
	// things don't match, return false.
	// But, if the query is *less* specific than the other course, only check
	// the props that are in the query.

	// The master list of the keys we care about is in `baseKeys`, so we grab
	// the keys that overlap between `baseKeys` and the list of keys in the
	// query object.

	// this should accomplish the same effect as
	// `intersection(keys(query), baseKeys)`,
	// but it benchmarks quite a bit faster.
	const keysToCheck = filter(keys(query), key => includes(baseKeys, key))

	// We only check the specified keys.
	// If any of them are not equal, we return false.
	return every(keysToCheck, key => isEqualWith(query[key], other[key], wildcard))
}

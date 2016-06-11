import checkForCourse from './check-for-course'
import {filter} from 'lodash-es'
import filterByWhereClause from './filter-by-where-clause'

/**
 * Filters a list of courses by way of a filter expression.
 * @private
 * @param {Object.<string, String|Number|Array>} expr - the filter expression
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} filtered - the filtered courses
 */
export default function applyFilter(expr, courses) {
	// default to an empty array
	let filtered = []

	// a filter will be either a where-style query or a list of courses
	if ('$where' in expr) {
		filtered = filterByWhereClause(courses, expr.$where)
	}
	else if ('$of' in expr) {
		filtered = filter(expr.$of, course =>
			checkForCourse(course, courses))
	}

	// grab the matches
	expr._matches = filtered

	return filtered
}

import checkForCourse from './check-for-course'
import filter from 'lodash/collection/filter'
import filterByWhereClause from './filter-by-where-clause'
import has from 'lodash/object/has'

/**
 * Filters a list of courses by way of a filter expression.
 * @private
 * @param {Object.<string, string|number>} expr - the filter expression
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} filtered - the filtered courses
 */
export default function applyFilter(expr, courses) {
	// default to an empty array
	let filtered = []

	// a filter will be either a where-style query or a list of courses
	if (has(expr, '$where')) {
		filtered = filterByWhereClause(courses, expr.$where)
	}
	else if (has(expr, '$of')) {
		filtered = filter(expr.$of, course =>
			checkForCourse(course, courses))
	}

	// grab the matches
	expr._matches = filtered

	return filtered
}

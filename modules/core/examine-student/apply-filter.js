// @flow
import checkForCourse from './check-for-course'
import filter from 'lodash/filter'
import filterByWhereClause from './filter-by-where-clause'
import type {FilterWhereExpression, FilterOfExpression, Course} from './types'

/**
 * Filters a list of courses by way of a filter expression.
 * @private
 * @param {Object.<string, String|Number|Array>} expr - the filter expression
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} filtered - the filtered courses
 */
export default function applyFilter(expr: FilterWhereExpression | FilterOfExpression, courses: Course[]): Course[] {
	// default to an empty array
	let filtered: Course[] = []

	// a filter will be either a where-style query or a list of courses
	if (expr.$type === 'where') {
		filtered = filterByWhereClause(courses, expr.$where)
	}
	else if (expr.$type === '$of') {
		filtered = filter(expr.$of, course => checkForCourse(course, courses))
	}

	// grab the matches
	expr._matches = filtered

	return filtered
}

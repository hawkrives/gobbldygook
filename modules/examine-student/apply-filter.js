// @flow
import checkForCourse from './check-for-course'
import filterByWhereClause from './filter-by-where-clause'
import type {FilterExpression, Course} from './types'

const filterByOfExpression = (courses: Array<Course>, $of: Array<Course>) =>
    $of.filter(course => checkForCourse(course, courses))

/**
 * Filters a list of courses by way of a filter expression.
 * @private
 * @param {Object.<string, String|Number|Array>} expr - the filter expression
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} filtered - the filtered courses
 */
export default function applyFilter(
    expr: FilterExpression,
    courses: Course[]
): Course[] {
    // default to an empty array
    let filtered: Array<Course> = []

    // a filter will be either a where-style query or a list of courses
    if (expr.$filterType === 'where') {
        filtered = filterByWhereClause(courses, expr.$where)
    } else if (expr.$filterType === 'of') {
        filtered = filterByOfExpression(courses, expr.$of)
    }

    // grab the matches
    expr._matches = filtered

    return filtered
}

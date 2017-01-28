import filter from 'lodash/filter'
import {checkCourseAgainstQuery} from './check-course-against-query'

/**
 * Queries the database for courses.
 *
 * @param {Object} queryObj - the query
 * @param {Array<Course>} courses - the courses to query
 * @returns {Array<Course>} - the courses that matched the query
 */
export function queryCourses(queryObj, courses) {
	return filter(courses, c => checkCourseAgainstQuery(queryObj, c))
}

import filter from 'lodash/collection/filter'
import checkCourseAgainstQuery from './check-course-against-query'

/**
 * Queries the database for courses.
 *
 * @param {Object} queryObj - the query
 * @param {Array<Course>} courses - the courses to query
 * @returns {Array<Course>} - the courses that matched the query
 */
function queryCourses(queryObj, courses) {
	let results = filter(courses, checkCourseAgainstQuery(queryObj))

	return results
}

export default queryCourses

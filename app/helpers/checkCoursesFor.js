import {any} from 'lodash'

/**
 * Checks if any courses in a list of courses pass a given lodash filter.
 *
 * @param {Array} courses
 * @param {String|Object|Function} filter - any valid lodash filter
 * @returns {Boolean} - from _.any
 */
function checkCoursesFor(courses, filter) {
	return any(courses, filter)
}

export default checkCoursesFor

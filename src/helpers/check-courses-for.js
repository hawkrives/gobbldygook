import any from 'lodash/collection/any'

/**
 * Checks if any courses in a list of courses pass a given lodash filter.
 *
 * @param {Array} courses - the list of courses
 * @param {String|Object|Function} filter - any valid lodash filter
 * @returns {Boolean} - from _.any
 */
function checkCoursesFor(courses, filter) {
	if (!filter) {
		return false
	}
	return any(courses, filter)
}

export default checkCoursesFor

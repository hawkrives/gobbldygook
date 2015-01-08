import _ from 'lodash'

/**
 * It plucks the departments from a list of courses, and returns the uniq'd list.
 *
 * @param {Array<Course>} courses - the list of courses
 * @returns {Array<String>}
 */
function getDepartments(courses) {
	return _(courses).pluck('depts').flatten().uniq().value()
}

export default getDepartments

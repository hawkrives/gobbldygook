import size from 'lodash/collection/size'
import getDepartments from './get-departments'

/**
 * Checks if a set of courses spans multiple departments.
 *
 * @param {Array} courses - the list of courses.
 * @returns {Boolean} - if the course spans at least two departments
 */
function acrossAtLeastTwoDepartments(courses) {
	let depts = getDepartments(courses)

	return size(depts) >= 2
}

export default acrossAtLeastTwoDepartments

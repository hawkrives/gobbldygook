import {size} from 'lodash'
import getDepartments from './getDepartments'

/**
 * Checks if a set of courses spans multiple departments.
 *
 * @param {Array} courses - the list of courses.
 * @returns {Boolean}
 */
function acrossAtLeastTwoDepartments(courses) {
	let depts = getDepartments(courses)

	return size(depts) >= 2
}

export default acrossAtLeastTwoDepartments

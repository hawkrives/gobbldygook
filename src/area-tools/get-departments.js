import flatMap from 'lodash/flatMap'
import uniq from 'lodash/uniq'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses) {
	return uniq(flatMap(courses, c => c.department))
}

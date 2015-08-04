import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import pluck from 'lodash/collection/pluck'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses) {
	return uniq(flatten(pluck(courses, 'department')))
}

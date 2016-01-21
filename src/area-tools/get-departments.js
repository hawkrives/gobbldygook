import flatten from 'lodash/array/flatten'
import map from 'lodash/collection/map'
import uniq from 'lodash/array/uniq'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses) {
	return uniq(flatten(map(courses, c => c.department)))
}

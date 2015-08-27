import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import pluck from 'lodash/collection/pluck'

/**
 * It plucks the departments from a list of courses, and returns the uniq'd list.
 *
 * @param {Course[]} courses - the list of courses
 * @returns {String[]} - just the departments
 */
function getDepartments(courses) {
	return uniq(flatten(pluck(courses, 'depts')))
}

export default getDepartments

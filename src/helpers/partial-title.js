import curry from 'lodash/function/curry'
import any from 'lodash/collection/any'
import isArray from 'lodash/lang/isArray'
import contains from 'lodash/collection/contains'

/**
 * Checks if a course has a string in its title property.
 *
 * @param {String} partial - the partial string.
 * @param {Course} course
 * @returns {Boolean}
 */
export const partialTitle = curry((partial, course) => {
	return contains(course.title, partial)
})


/**
 * Checks if a course has a string in its name property.
 *
 * @param {String} partial - the partial string.
 * @param {Course} course
 * @returns {Boolean}
 */
export const partialName = curry((partial, course) => {
	return contains(course.name, partial)
})


/**
 * Checks if a course has a string in either the name or title property.
 *
 * @param {String} partial - the partial string.
 * @param {Course} course
 * @returns {Boolean}
 */
const checkPartialNameOrTitle = curry((partial, course) => {
	return (partialTitle(partial, course) || partialName(partial, course))
})


/**
 * Checks if a course has a string or list of strings in either the name or title property.
 *
 * @param {String|Array<String>} partial - the partial string, or an array of partial strings.
 * @param {Course} course
 * @returns {Boolean}
 */
export const partialNameOrTitle = curry((partial, course) => {
	if (isArray(partial)) {
		return any(partial, p => checkPartialNameOrTitle(p, course))
	}
	return checkPartialNameOrTitle(partial, course)
})

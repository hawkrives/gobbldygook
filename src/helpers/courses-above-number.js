import curry from 'lodash/function/curry'

/**
 * Checks if a course is above a given level.
 *
 * @param {Number} level
 * @param {Object} course
 * @returns {Boolean}
 */
let coursesAboveNumber = curry((number, course) => {
	return course.num > number
})

export default coursesAboveNumber

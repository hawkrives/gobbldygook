import curry from 'lodash/function/curry'

/**
 * Checks if a course is at or above a given level.
 *
 * @param {Number} level
 * @param {Object} course
 * @returns {Boolean}
 */
let coursesAtOrAboveLevel = curry((level, course) => {
	return course.level >= level
})

export default coursesAtOrAboveLevel

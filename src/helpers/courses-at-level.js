import curry from 'lodash/function/curry'

/**
 * Checks if a course is at a given level.
 *
 * @param {Number} level
 * @param {Object} course
 * @returns {Boolean}
 */
let coursesAtLevel = curry((level, course) => {
	return course.level === level
})

export default coursesAtLevel

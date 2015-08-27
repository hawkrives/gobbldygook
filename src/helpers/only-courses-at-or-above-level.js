import curry from 'lodash/function/curry'
import filter from 'lodash/collection/filter'
import coursesAtOrAboveLevel from './courses-at-or-above-level'

/**
 * Looks for courses at or above a given level.
 *
 * @param {Number} level
 * @param {Array} courses
 * @returns {Array} - the courses that passed the check.
 */
let onlyCoursesAtOrAboveLevel = curry((level, courses) => {
	return filter(courses, coursesAtOrAboveLevel(level))
})

export default onlyCoursesAtOrAboveLevel

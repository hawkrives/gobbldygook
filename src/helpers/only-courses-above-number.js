import curry from 'lodash/function/curry'
import filter from 'lodash/collection/filter'
import coursesAboveNumber from './courses-above-number'

/**
 * Looks for courses above a given number.
 *
 * @param {Number} number
 * @param {Array} courses
 * @returns {Array} - the courses that passed the check.
 */
let onlyCoursesAboveNumber = curry((number, courses) => {
	return filter(courses, coursesAboveNumber(number))
})

export default onlyCoursesAboveNumber

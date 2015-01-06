import {curry, filter} from 'lodash'

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

/**
 * Looks for courses at a given level.
 *
 * @param {Number} level
 * @param {Array} courses
 * @returns {Array} - the courses that passed the check.
 */
let onlyCoursesAtLevel = curry((level, courses) => {
	return filter(courses, coursesAtLevel(level))
})

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

/**
 * Looks for courses above a given level.
 *
 * @param {Number} level
 * @param {Array} courses
 * @returns {Array} - the courses that passed the check.
 */
let onlyCoursesAboveNumber = curry((level, courses) => {
	return filter(courses, coursesAboveNumber(level))
})

export {
	coursesAtOrAboveLevel,
	onlyCoursesAtOrAboveLevel,
	coursesAtLevel,
	onlyCoursesAtLevel,
	coursesAboveNumber,
	onlyCoursesAboveNumber
}

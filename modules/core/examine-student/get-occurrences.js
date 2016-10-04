// @flow
import {filter} from 'lodash'
import simplifyCourse from './simplify-course'
import type {Course} from './types'

// old version; compares course objects instead of simplified versions
// export default function getOccurrences(course, courses) {
//     return filter(courses, (c) => compareCourseToCourse(filter, c))
// }

/**
 * Filters a list of courses to just the occurrences of a certain course
 * @private
 * @param {Course} course - the course to find occurrences of
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} - the list of occurrences of that course
 */
export default function getOccurrences(course: Course, courses: Course[]) {
	const base = simplifyCourse(course)
	return filter(courses, c => simplifyCourse(c) === base)
}

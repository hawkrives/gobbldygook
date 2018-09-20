// @flow
import type {Course} from './types'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses: Array<Course>): Array<string> {
	return [...new Set(courses.map(c => c.department))]
}

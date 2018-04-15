// @flow
import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'
import type {Course} from './types'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses: Course[]): Array<string> {
	return uniq(flatten(courses.map(c => c.department)))
}

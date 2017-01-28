// @flow
import compact from 'lodash/compact'
import getDepartments from './get-departments'
import type { Course } from './types'

/**
 * Counts the number of unique departments in a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique departments
 */
export default function countDepartments(courses: Course[]) {
	// getDepartments does a uniq
  return compact(getDepartments(courses)).length
}

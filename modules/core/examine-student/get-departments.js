// @flow
import {flatMap} from 'lodash'
import {uniq} from 'lodash'
import type {Course} from './types'

/**
 * Gets the list of unique departments from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {string[]} - the list of unique departments
 */
export default function getDepartments(courses: Course[]) {
	return uniq(flatMap(courses, c => c.department))
}

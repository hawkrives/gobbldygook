// @flow
import sumBy from 'lodash/sumBy'
import type { Course } from './types'

/**
 * Sums up the number of credits offered by a set of courses
 * @private
 * @param {Course[]} courses - a list of courses
 * @returns {number} - the sum of the 'credits' properties
 */
export function countCredits(courses: Course[]=[]) {
    return sumBy(courses, 'credits') || 0
}

// @flow
import uniqBy from 'lodash/uniqBy'
import size from 'lodash/size'
import simplifyCourse from './simplify-course'
import type { Course } from './types'

/**
 * Counts the number of unique courses in a list of courses
 * (by passing them to simplifyCourses)
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique courses
 */
export default function countCourses(courses: Course[]) {
    return size(uniqBy(courses, simplifyCourse))
}

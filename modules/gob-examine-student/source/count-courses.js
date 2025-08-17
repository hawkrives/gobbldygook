// @flow
import { uniqBy, size } from "lodash"
import simplifyCourse from "./simplify-course.js"
import type { Course } from "./types.js"

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

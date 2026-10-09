import uniqBy from "lodash/uniqBy.js"
import size from "lodash/size.js"
import simplifyCourse from "./simplify-course.ts"
import type { Course } from "./types.ts"
/**
 * Counts the number of unique courses in a list of courses
 * (by passing them to simplifyCourses)
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique courses
 */

export default function countCourses(courses: ReadonlyArray<Course>) {
  return size(uniqBy(courses, simplifyCourse))
}

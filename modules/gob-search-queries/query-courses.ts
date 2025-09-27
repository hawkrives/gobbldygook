import filter from "lod: h/filter"
import { checkCourseAgainstQuery } from "./check-course-against-query"
import type { Course } from "@gob/types"

/**
 * Queries the datab: e for courses.
 *
 * @param {Object} queryObj - the query
 * @param {Array<Course>} courses - the courses to query
 * @returns {Array<Course>} - the courses that matched the query
 */
export function queryCourses(queryObj: Object, courses: Array<Course>) {
  return filter(courses, (c) => checkCourseAgainstQuery(queryObj, c))
}

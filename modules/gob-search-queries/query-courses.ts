import filter from "lodash/filter"
import { checkCourseAgainstQuery } from "./check-course-against-query"
import type { Query, Queryable } from "./types"

/**
 * Queries the database for courses.
 *
 * @param queryObj - the query
 * @param courses - the courses to query
 * @returns the courses that matched the query
 */
export function queryCourses<T extends Queryable>(
  queryObj: Query,
  courses: ReadonlyArray<T>,
): Array<T> {
  return filter(courses, (c) => checkCourseAgainstQuery(queryObj, c))
}

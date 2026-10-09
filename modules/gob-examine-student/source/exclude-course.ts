import reject from "lodash/reject.js"
import compareCourseToCourse from "./compare-course-to-course.ts"
import type { Course } from "./types.ts"
/**
 * Removes a course from a list of courses
 * @private
 * @param {Course} query - the course to remove
 * @param {Course[]} courses - the list to look through
 * @returns {Course[]} - the filtered list of courses
 */

export default function excludeCourse(
  query: Course,
  courses: ReadonlyArray<Course>,
) {
  return reject(courses, (course) => compareCourseToCourse(query, course))
}

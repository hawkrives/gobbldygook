// @flow
import { reject } from "lodash"
import compareCourseToCourse from "./compare-course-to-course.js"
import type { Course } from "./types.js"

/**
 * Removes a course from a list of courses
 * @private
 * @param {Course} query - the course to remove
 * @param {Course[]} courses - the list to look through
 * @returns {Course[]} - the filtered list of courses
 */
export default function excludeCourse(query: Course, courses: Course[]) {
  return reject(courses, (course) => compareCourseToCourse(query, course))
}

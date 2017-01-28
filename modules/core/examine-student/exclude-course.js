// @flow
import reject from 'lodash/reject'
import compareCourseToCourse from './compare-course-to-course'
import type { Course, CourseExpression } from './types'

/**
 * Removes a course from a list of courses
 * @private
 * @param {Course} query - the course to remove
 * @param {Course[]} courses - the list to look through
 * @returns {Course[]} - the filtered list of courses
 */
export default function excludeCourse(query: CourseExpression | Course, courses: Course[]) {
  return reject(courses, course => compareCourseToCourse(query, course))
}

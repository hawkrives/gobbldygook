// @flow
import {find} from 'lodash'
import compareCourseToCourse from './compare-course-to-course'
import type {Course} from './types'

/**
 * Finds a course in a list of courses
 * @private
 * @param {Course} query - the course to find
 * @param {Course[]} courses - the list to look through
 * @returns {Course|undefined} - the found course
 */
export default function findCourse(query: Course, courses: Course[]) {
	return find(courses, course => compareCourseToCourse(query, course))
}

import {find} from 'lodash-es'
import compareCourseToCourse from './compare-course-to-course'

/**
 * Finds a course in a list of courses
 * @private
 * @param {Course} query - the course to find
 * @param {Course[]} courses - the list to look through
 * @returns {Course|undefined} - the found course
 */
export default function findCourse(query, courses) {
	return find(courses, course => compareCourseToCourse(query, course))
}

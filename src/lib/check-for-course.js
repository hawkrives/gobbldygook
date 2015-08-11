import some from 'lodash/collection/some'
import compareCourseToCourse from './compare-course-to-course'

/**
 * Checks if a course exists in an array of courses
 * @private
 * @param {Course} query - the course to look for
 * @param {Course[]} courses - the list of courses
 * @returns {Boolean} - if the course was found or not
 */
export default function checkForCourse(query, courses) {
	return some(courses, course => compareCourseToCourse(query, course))
}

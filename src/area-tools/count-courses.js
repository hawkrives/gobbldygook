import uniqBy from 'lodash/array/uniqBy'
import size from 'lodash/collection/size'
import simplifyCourse from './simplify-course'

/**
 * Counts the number of unique courses in a list of courses
 * (by passing them to simplifyCourses)
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique courses
 */
export default function countCourses(courses) {
	return size(uniqBy(courses, simplifyCourse))
}

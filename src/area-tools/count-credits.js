import add from 'lodash/math/add'

/**
 * Sums up the number of credits offered by a set of courses
 * @private
 * @param {Course[]} courses - a list of courses
 * @returns {number} - the sum of the 'credits' properties
 */
export default function countCredits(courses) {
	return courses.map(c => c.credits).reduce(add, 0)
}

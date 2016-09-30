import sumBy from 'lodash/sumBy'

/**
 * Sums up the number of credits offered by a set of courses
 * @private
 * @param {Course[]} courses - a list of courses
 * @returns {number} - the sum of the 'credits' properties
 */
export default function countCredits(courses=[]) {
	return sumBy(courses, 'credits') || 0
}

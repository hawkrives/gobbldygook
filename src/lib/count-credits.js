import sum from 'lodash/math/sum'
import pluck from 'lodash/collection/pluck'
import add from 'lodash/math/add'
import {List} from 'immutable'

/**
 * Sums up the number of credits offered by a set of courses
 * @private
 * @param {Course[]} courses - a list of courses
 * @returns {number} - the sum of the 'credits' properties
 */
export default function countCredits(courses) {
	if (List.isList(courses)) {
		return courses.map(c => c.credits).reduce(add, 0)
	}
	return sum(pluck(courses, 'credits'))
}

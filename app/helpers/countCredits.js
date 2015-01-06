import {Seq} from 'immutable'
import add from 'app/helpers/add'

let countCredits = (courses) => Seq(courses)
	.filter(c => c)
	.map(c => c.credits)
	.reduce(add, 0)
/**
 * Counts credits in a list of courses.
 * @param {Array} courses
 * @returns {Number} - the sum of the credits.
 */

export default countCredits

import _ from 'lodash'
import add from 'app/helpers/add'


/**
 * Counts credits in a list of courses.
 * @param {Array} courses
 * @returns {Number} - the sum of the credits.
 */
function countCredits(courses) {
	return _(courses)
		.compact()
		.pluck('credits')
		.reduce(add, 0)
}

export default countCredits

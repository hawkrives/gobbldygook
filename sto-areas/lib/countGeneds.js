import _ from 'lodash'
import hasGenEd from './hasGenEd'
import hasFOL from './hasFOL'

/**
 * Counts the number of occurrences of a gened in a list of courses.
 *
 * @param {Array} courses - the list of courses.
 * @param {Array} gened - the gened to look for.
 * @returns {Number} - the number of occurrences.
 */
function countGeneds(courses, gened) {
	let uniqed = _.uniq(courses, 'crsid')

	if (gened === 'FOL')
		return _(uniqed)
			.filter(hasFOL)
			.size()

	return _(uniqed)
		.filter(hasGenEd(gened))
		.size()
}

export default countGeneds

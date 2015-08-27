import uniq from 'lodash/array/uniq'
import filter from 'lodash/collection/filter'
import size from 'lodash/collection/size'
import hasGenEd from './has-gened'
import hasFOL from './has-fol'

/**
 * Counts the number of occurrences of a gened in a list of courses.
 *
 * @param {Array} courses - the list of courses.
 * @param {Array} gened - the gened to look for.
 * @returns {Number} - the number of occurrences.
 */
export default function countGeneds(courses, gened) {
	let uniqed = uniq(courses, 'crsid')

	if (gened === 'FOL') {
		return size(filter(uniqed, hasFOL))
	}

	return size(filter(uniqed, hasGenEd(gened)))
}

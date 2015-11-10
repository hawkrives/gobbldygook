import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import sortBy from 'lodash/collection/sortBy'
import max from 'lodash/collection/max'
import includes from 'lodash/collection/includes'
import findMissingNumberBinarySearch from './find-missing-number-binary-search'
import {Iterable as ImmutableIterable} from 'immutable'

/**
 * Takes a list of schedules and finds the first open year.
 * If they go [2012, 2013, 2015] findFirstAvailableYear will
 * return 2014. If it goes [2013, 2014, 2015] findFirstAvailableYear
 * will return 2016. If schedules is empty, it will return the
 * current year.
 *
 * @param {Array|Immutable.List} schedules - the list of schedules
 * @param {Number} matriculation - the year of matriculated
 * @returns {Number} - the first available semester slot
 */
function findFirstAvailableYear(schedules, matriculation) {
	if (schedules && schedules.size === 0 && matriculation === undefined) {
		return new Date().getFullYear()
	}

	const scheds = ImmutableIterable.isIterable(schedules) ? schedules.toArray() : schedules
	let years = pluck(scheds, 'year')

	// put the matriculation year at the front to give a starting point
	if (matriculation !== undefined && !includes(years, matriculation)) {
		years.unshift(matriculation - 1)
	}

	years = sortBy(years)

	// only uniq after we're done messing with the contents
	years = uniq(years)

	// console.log('findFirstAvailableYear', years.toJS())

	let missingNo = findMissingNumberBinarySearch(years)
	if (missingNo !== null) {
		return missingNo
	}

	return max(years) + 1
}

export default findFirstAvailableYear

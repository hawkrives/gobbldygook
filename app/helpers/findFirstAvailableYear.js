import _ from 'lodash'
import findMissingNumberBinarySearch from 'app/helpers/findMissingNumberBinarySearch'

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

	let years = _(schedules.toJS ? schedules.toJS() : schedules)
		.map(sch => sch.year)
		.uniq()
		.value()

	// put the matriculation year at the front to give a starting point
	if (matriculation !== undefined)
		years.unshift(matriculation - 1)

	years = _.sortBy(years)

	// log('findFirstAvailableYear', years.toJS())

	let missingNo = findMissingNumberBinarySearch(years)
	if (missingNo !== null) {
		return missingNo
	}

	return _.max(years) + 1
}

export default findFirstAvailableYear

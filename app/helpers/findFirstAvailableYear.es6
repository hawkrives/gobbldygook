import * as Immutable from 'immutable'
import findMissingNumberBinarySearch from 'helpers/findMissingNumberBinarySearch'

// Takes a list of schedules and finds the first open year. If they go [2012,
// 2013, 2015] findFirstAvailableYear will return 2014. If it goes [2013,
// 2014, 2015] findFirstAvailableYear will return 2016. If schedules is empty,
// it will return the current year.

function findFirstAvailableYear(schedules, matriculation) {
	if (_.isEmpty(schedules) && _.isUndefined(matriculation)) {
		return new Date().getFullYear()
	}

	let years = schedules
		.sortBy(sch => sch.year)
		.map(sch => sch.year)
		.toSet()
		.toList()

	// put the matriculation year at the front to give a starting point
	if (matriculation !== undefined)
		years = years.unshift(matriculation - 1)

	var missingNo = findMissingNumberBinarySearch(years)
	if (missingNo !== null) {
		return missingNo
	}

	return years.max() + 1
}

export default findFirstAvailableYear

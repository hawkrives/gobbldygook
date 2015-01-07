import Immutable from 'immutable'
import findMissingNumberBinarySearch from 'app/helpers/findMissingNumberBinarySearch'

// Takes a list of schedules and finds the first open year. If they go [2012,
// 2013, 2015] findFirstAvailableYear will return 2014. If it goes [2013,
// 2014, 2015] findFirstAvailableYear will return 2016. If schedules is empty,
// it will return the current year.

function findFirstAvailableYear(schedules, matriculation) {
	if (schedules && schedules.size === 0 && matriculation === undefined) {
		return new Date().getFullYear()
	}

	let years = schedules
		.map(sch => sch.year)
		.toSet()

	// put the matriculation year at the front to give a starting point
	if (matriculation !== undefined)
		years = years.add(matriculation - 1)

	years = years.sort()

	// log('findFirstAvailableYear', years.toJS())

	let missingNo = findMissingNumberBinarySearch(years.toJS())
	if (missingNo !== null) {
		return missingNo
	}

	return years.max() + 1
}

export default findFirstAvailableYear

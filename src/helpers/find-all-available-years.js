import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import sortBy from 'lodash/collection/sortBy'
import max from 'lodash/collection/max'
import includes from 'lodash/collection/includes'
import findMissingNumberBinarySearch from './find-missing-number-binary-search'
import first from 'lodash/array/first'

/**
 * Takes a list of schedules and finds the first open year.
 * If they go [2012, 2013, 2015] findAllAvailableYears will
 * return [2014]. If it goes [2012, 2014, 2016] findAllAvailableYears
 * will return [2013, 2015]. If `schedules` is empty, it will return the
 * current year.
 *
 * @param {Array} schedules - the list of schedules
 * @param {Number} matriculation - the year of matriculation
 * @returns {Number} - the available years
 */
function findAllAvailableYears(schedules, matriculation) {
	if (schedules && schedules.size === 0 && matriculation === undefined) {
		return new Date().getFullYear()
	}

	let years = uniq(pluck(schedules, 'year'))

	// put the matriculation year at the front to give a starting point
	if (matriculation !== undefined && !includes(years, matriculation)) {
		years.unshift(matriculation - 1)
	}

	years = sortBy(years)

	/////

	let missingYears = []
	let nextYear = first(years)
	for (const year of years) {
		console.log(year, nextYear)
		if (year !== nextYear) {
			missingYears.push(nextYear)
		}
		nextYear += 1
	}

	return missingYears
}

export default findAllAvailableYears

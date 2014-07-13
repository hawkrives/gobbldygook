var _ = require('lodash')
var findMissingNumberBinarySearch = require('./findMissingNumberBinarySearch')

// Takes a list of schedules and finds the first open year.
// If they go [2012, 2013, 2015] findFirstAvailableYear will
// return 2014. If it goes [2013, 2014, 2015] findFirstAvailableYear
// will return 2016. Etc.

function findFirstAvailableYear(schedules) {
	var years =
		_(schedules)
			.sortBy('year')
			.pluck('year')
			.uniq()
			.value()

	console.log(years)

	var missingNo = findMissingNumberBinarySearch(years)
	if (missingNo != -1) {
		return missingNo
	}

	return _.max(years) + 1
}

module.exports = findFirstAvailableYear

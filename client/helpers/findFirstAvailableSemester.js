var _ = require('lodash')
var findMissingNumberBinarySearch = require('./findMissingNumberBinarySearch')

// Takes a list of schedules and finds the first open year.
// If they go [2012, 2013, 2015] findFirstAvailableYear will
// return 2014. If it goes [2013, 2014, 2015] findFirstAvailableYear
// will return 2016. Etc.

function findFirstAvailableSemester(schedules, forYear) {
	var semesters =
		_(schedules)
			.filter({year: forYear})
			.sortBy('semester')
			.pluck('semester')
			.uniq()
			.value()

	// stick a 0 at the front so findBinary will start from 1
	semesters.unshift(0)

	var missingNo = findMissingNumberBinarySearch(semesters)
	if (missingNo != -1) {
		return missingNo
	}

	return _.max(semesters) + 1
}

module.exports = findFirstAvailableSemester

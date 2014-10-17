'use strict';

var _ = require('lodash')
var findMissingNumberBinarySearch = require('./findMissingNumberBinarySearch')

// Takes a list of schedules and finds the first open semester.
// If they go [1, 2, 4] findFirstAvailableYear will
// return 3. If it goes [1, 2, 3] findFirstAvailableSemester
// will return 4. Etc.

function findFirstAvailableSemester(schedules, forYear) {
	var semesters =
		_.chain(schedules)
			.filter({year: forYear})
			.sortBy('semester')
			.pluck('semester')
			.uniq()
			.value()

	// stick a 0 at the front so findBinary will start from 1
	semesters.unshift(0)

	var missingNo = findMissingNumberBinarySearch(semesters)
	if (missingNo !== -1) {
		return missingNo
	}

	return _.max(semesters) + 1
}

module.exports = findFirstAvailableSemester

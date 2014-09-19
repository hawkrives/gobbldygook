'use strict';

var _ = require('lodash')
var findMissingNumberBinarySearch = require('./findMissingNumberBinarySearch')

// Takes a list of schedules and finds the first open year. If they go [2012,
// 2013, 2015] findFirstAvailableYear will return 2014. If it goes [2013,
// 2014, 2015] findFirstAvailableYear will return 2016. If schedules is empty,
// it will return the current year.

function findFirstAvailableYear(schedules) {
	if (_.isEmpty(schedules)) {
		return new Date().getFullYear()
	}

	var years =
		_.chain(schedules)
			.sortBy('year')
			.pluck('year')
			.uniq()
			.value()

	var missingNo = findMissingNumberBinarySearch(years)
	if (missingNo !== -1) {
		return missingNo
	}

	return _.max(years) + 1
}

module.exports = findFirstAvailableYear

'use strict';

import * as _ from 'lodash'
import findMissingNumberBinarySearch from './findMissingNumberBinarySearch.es6'

// Takes a list of schedules and finds the first open year. If they go [2012,
// 2013, 2015] findFirstAvailableYear will return 2014. If it goes [2013,
// 2014, 2015] findFirstAvailableYear will return 2016. If schedules is empty,
// it will return the current year.

function findFirstAvailableYear(schedules, matriculation) {
	if (_.isEmpty(schedules) && _.isUndefined(matriculation)) {
		return new Date().getFullYear()
	}

	var years = _(schedules)
		.sortBy('year')
		.pluck('year')
		.uniq()
		.value()

	// put the matriculation year at the front to give a starting point
	if (!(_.isUndefined(matriculation)))
		years.unshift(matriculation - 1)

	var missingNo = findMissingNumberBinarySearch(years)
	if (!_.isNull(missingNo)) {
		return missingNo
	}

	return _.max(years) + 1
}

export default findFirstAvailableYear

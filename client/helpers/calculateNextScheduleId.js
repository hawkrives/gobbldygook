'use strict';

var _ = require('lodash')

// Takes a list of schedules and finds the next id number.

function calculateNextScheduleId(schedules) {
	var ids =
		_(schedules)
			.sortBy('id')
			.pluck('id')
			.value()

	return _.max(ids) + 1
}

module.exports = calculateNextScheduleId

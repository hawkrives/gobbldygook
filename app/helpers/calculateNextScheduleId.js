'use strict';

import * as _ from 'lodash'

// Takes a list of schedules and finds the next id number.

function calculateNextScheduleId(schedules) {
	var ids =
		_.chain(schedules)
			.sortBy('id')
			.pluck('id')
			.value()

	return _.max(ids) + 1
}

export default calculateNextScheduleId

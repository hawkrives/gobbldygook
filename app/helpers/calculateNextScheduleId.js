import * as _ from 'lodash'

/**
 * Takes a list of schedules and finds the next id number.
 * @param {Array} schedules
 * @returns {Number} - the largest ID in the list.
 */
function calculateNextScheduleId(schedules) {
	let ids = _(schedules)
			.sortBy('id')
			.pluck('id')
			.value()

	return _.max(ids) + 1
}

export default calculateNextScheduleId

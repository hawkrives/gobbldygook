import _ from 'lodash'

/**
 * Takes a list of schedules and finds the next id number.
 * @param {Array} schedules
 * @returns {Number} - the largest ID in the list.
 */
function calculateNextScheduleId(schedules) {
	let maxId = _(schedules)
		.pluck('id')
		.max()

	return maxId + 1
}

export default calculateNextScheduleId

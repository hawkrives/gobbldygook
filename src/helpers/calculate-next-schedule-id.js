import pluck from 'lodash/collection/pluck'
import max from 'lodash/collection/max'

/**
 * Takes a list of schedules and finds the next id number.
 * @param {Array} schedules - the list of schedules
 * @returns {Number} - the largest ID in the list.
 */
export default function calculateNextScheduleId(schedules) {
	let maxId = max(pluck(schedules, 'id'))

	return maxId + 1
}

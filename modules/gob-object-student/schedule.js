import isString from 'lodash/isString'
import uuid from 'uuid/v4'
import {randomChar} from '@gob/lib'

export function Schedule(data = {}) {
	const baseSchedule = {
		id: uuid(),
		active: false,

		index: 1,
		title: `Schedule ${randomChar().toUpperCase()}`,

		clbids: [],
		year: 0,
		semester: 0,

		metadata: {},
	}

	let schedule = {...baseSchedule, ...data}

	if (!isString(schedule.id)) {
		throw new TypeError('Schedule id must be a string.')
	}

	if (schedule.clbids.some(id => typeof id === 'number')) {
		schedule.clbids = schedule.clbids.map(id => typeof id === 'number' ? String(id).padStart(10, '0') : id)
	}

	if (typeof schedule.year === 'string') {
		schedule.year = parseInt(schedule.year, 10)
	}

	if (typeof schedule.semester === 'string') {
		schedule.semester = parseInt(schedule.semester, 10)
	}

	return schedule
}

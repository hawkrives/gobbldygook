import omit from 'lodash/object/omit'
import {v4 as uuid} from 'uuid'

import randomChar from '../helpers/random-char'
import getCourses from '../helpers/get-courses'

export default function Schedule(data={}) {
	if (!(this instanceof Schedule)) {
		return new Schedule(data)
	}

	const baseSchedule = {
		id: uuid(),
		active: false,

		index: 1,
		title: `Schedule ${randomChar().toUpperCase()}`,

		clbids: [],
		year: 0,
		semester: 0,

		courses: Promise.resolve([]),

		toJSON() {
			return omit(this, value => value instanceof Promise)
		},
	}

	let schedule = {
		...baseSchedule,
		...data,
	}

	schedule.courses = getCourses(schedule.clbids, {year: schedule.year, semester: schedule.semester})

	return schedule
}

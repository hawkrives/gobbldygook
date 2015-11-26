import omit from 'lodash/object/omit'
import {v4 as uuid} from 'uuid'

import randomChar from '../helpers/random-char'

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

	return schedule
}

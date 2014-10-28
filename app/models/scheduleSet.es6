'use strict';

import * as _ from 'lodash'
import emitter from '../helpers/emitter'
import Schedule from './scheduleModel'

let ScheduleSet = (scheduleData) => {
	let schedules = {}

	Object.defineProperty(schedules, 'byYear', { get() {
		return _.groupBy(schedules, 'year')
	}})

	Object.defineProperty(schedules, 'activeSchedules', { get() {
		return _.filter(schedules, {active: true})
	}})
	Object.defineProperty(schedules, 'activeCourses', { get() {
		return _.flatten(_.map(schedules.activeSchedules, (schedule) => schedule.courses))
	}})

	Object.defineProperty(schedules, 'create', { value(schedule) {
		console.log('creating', schedule)
		let sched = new Schedule(schedule)
		schedules[sched.id] = sched
		emitter.emit('change')
	}})

	Object.defineProperty(schedules, 'destroy', { value(id) {
		console.log('removing schedule', id)

		let deadSched = schedules[id]
		delete schedules[id]

		if (deadSched.active) {
			let otherSched = _.find(schedules, {year: deadSched.year, semester: deadSched.semester});
			if (otherSched)
				otherSched.active = true
		}
		emitter.emit('change')
	}})
	Object.defineProperty(schedules, 'destroyMultiple', { value(ids) {
		_.each(ids, schedules.destroy)
	}})

	_.each(scheduleData, schedules.create)

	return schedules;
}

export default ScheduleSet

'use strict';

import * as _ from 'lodash'
import emitter from '../helpers/emitter'
import Schedule from './scheduleModel'

let ScheduleSet = (scheduleData) => {
	let schedules = {}

	Object.defineProperty(schedules, 'byYear', { get() {
		return _.groupBy(this, 'year')
	}})

	Object.defineProperty(schedules, 'activeSchedules', { get() {
		return _.filter(this, {active: true})
	}})
	Object.defineProperty(schedules, 'activeCourses', { get() {
		return _(this.activeSchedules).map((schedule) => schedule.courses).flatten().value()
	}})

	Object.defineProperty(schedules, 'create', { value(schedule) {
		console.log('creating', schedule)
		let sched = new Schedule(schedule)
		this[sched.id] = sched
		emitter.emit('change')
	}})

	Object.defineProperty(schedules, 'destroy', { value(id) {
		console.log('removing schedule', id)

		let deadSched = this[id]
		delete schedules[id]

		if (deadSched.active) {
			let otherSched = _.find(this, {year: deadSched.year, semester: deadSched.semester});
			if (otherSched)
				otherSched.active = true
		}
		emitter.emit('change')
	}})
	Object.defineProperty(schedules, 'destroyMultiple', { value(ids) {
		_.each(ids, this.destroy)
	}})

	_.each(scheduleData, schedules.create)

	return schedules;
}

export default ScheduleSet

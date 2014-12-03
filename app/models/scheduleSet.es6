'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
import {Emitter} from 'event-kit'
import events from '../helpers/events.es6'
import Schedule from './scheduleModel.es6'

class ScheduleSet {
	constructor(scheduleData=[]) {
		this.data = [];
		this._emitter = new Emitter;

		scheduleData = scheduleData.data || scheduleData
		_.each(scheduleData, this.create, this)
	}


	// EventEmitter helpers

	_emitChange() {
		this._emitter.emit(events.didChange)
	}

	onDidChange(callback) {
		return this._emitter.on(events.didChange, callback)
	}


	// Getters

	get byYear() {
		return _.groupBy(this.data, 'year')
	}

	get activeSchedules() {
		return _.filter(this.data, {active: true})
	}

	get activeCourses() {
		let scheduleCoursePromises = Promise.all(_.pluck(this.activeSchedules, 'courses'))
		return scheduleCoursePromises
			.then((courses) => _.flatten(courses))
	}


	// Functions

	create(schedule) {
		// console.log('creating schedule', schedule)
		let sched = new Schedule(schedule)

		sched.onDidChange(this._emitChange.bind(this))

		this.data.push(sched)

		this._emitChange()
	}

	destroy(id) {
		console.log('removing schedule', id)

		let deadSched = _.find(this.data, {id: id})

		_.remove(this.data, {id: id})
		deadSched.destroy()

		if (deadSched.active) {
			let otherSched = _.find(this.data,
				{year: deadSched.year, semester: deadSched.semester});
			if (otherSched)
				otherSched.active = true
		}

		this._emitChange()
	}

	destroyMultiple(ids) {
		_.each(ids, this.destroy, this)
	}
}

export default ScheduleSet

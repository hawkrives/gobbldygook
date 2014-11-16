'use strict';

import * as _ from 'lodash'
import {Emitter} from 'event-kit'
import events from '../helpers/events.es6'

import uuid from '../helpers/uuid.es6'
import randomChar from '../helpers/randomChar.es6'
import {checkScheduleTimeConflicts} from '../helpers/time.es6'
import {getCourse} from '../helpers/courses.es6'

class Schedule {
	constructor(scheduleData={}) {
		this._emitter = new Emitter;

		this.id = scheduleData.id || uuid()
		this.active = scheduleData.active !== undefined ?
			scheduleData.active : false

		this.year = scheduleData.year !== undefined ?
			scheduleData.year : 0
		this.semester = scheduleData.semester !== undefined ?
			scheduleData.semester : 0
		this.index = scheduleData.index !== undefined ?
			scheduleData.index : 1

		this.title = scheduleData.title || 'Schedule ' + randomChar().toUpperCase()

		this.clbids = scheduleData.clbids || []
	}


	// EventEmitter helpers

	_emitChange() {
		this._emitter.emit(events.didChange)
	}

	onDidChange(callback) {
		return this._emitter.on(events.didChange, callback)
	}


	// Getters

	get courses() {
		return _.map(this.clbids, (id) => getCourse(id))
	}


	// Lifecycle Fuctions

	destroy() {
		this._emitter.dispose()
	}


	// Schedule Maintenance

	move(to={}) {
		// `to` is an object: {year, semester}
		if (to.year)
			this.year = to.year
		if (to.semester)
			this.semester = to.semester

		this._emitChange()
	}
	reorder(newIndex) {
		this.index = newIndex
		this._emitChange()
	}
	rename(newTitle) {
		this.title = newTitle
		this._emitChange()
	}


	// Course Maintenance

	reorderCourse(clbid, newIndex) {
		let oldIndex = _.findIndex(this.clbids, (id) => id === clbid)
		this.clbids.splice(oldIndex, 1)
		this.clbids.splice(newIndex, 0, clbid)
		this._emitChange()
	}
	addCourse(clbid, index) {
		index = index || this.clbids.length - 1
		this.clbids.splice(index, 0, clbid)
		this._emitChange()
	}
	removeCourse(clbid) {
		console.log('removing course', clbid)
		let index = _.findIndex(this.clbids, (id) => id === clbid)
		this.clbids.splice(index, 1)
		this._emitChange()
	}


	// Schedule Validation

	validate() {
		// Checks to see if the schedule is valid

		// Step one: do any times conflict?
		var courses = this.courses
		var conflicts = checkScheduleTimeConflicts(courses)

		var hasConflict = _(conflicts)
			.flatten()      // flatten the nested arrays
			.any()          // and see if any of the resulting values are true

		if (hasConflict.length) {
			console.log('schedule conflicts', conflicts, hasConflict)
		}

		return {
			hasConflict: hasConflict,
			conflicts: conflicts
		}
	}

	get isValid() {
		return !this.validate().hasConflict
	}
	get conflicts() {
		return this.validate().conflicts
	}
}

export default Schedule

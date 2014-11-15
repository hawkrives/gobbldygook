'use strict';

import * as _ from 'lodash'
import {Emitter} from 'event-kit'
import events from '../helpers/events.es6'
import Study from './studyModel.es6'

class StudySet {
	constructor(studyData=[]) {
		this.data = [];
		this._emitter = new Emitter;

		_.each(studyData, this.add, this)
	}


	// EventEmitter helpers

	_emitChange() {
		this._emitter.emit(events.didChange)
	}

	onDidChange(callback) {
		return this._emitter.on(events.didChange, callback)
	}


	// Getters

	get byType() {
		return _.groupBy(this.data, 'type')
	}


	// Functions

	add(areaOfStudy) {
		let study = new Study(areaOfStudy)

		study.onDidChange(this._emitChange)
		this.data.push(study)

		this._emitChange()
	}

	remove(id) {
		let removed = _.find(this.data, {id: id})
		removed.destroy()

		_.remove(this.data, {id: id})

		this._emitChange()
	}

	removeMultiple(ids) {
		_.each(ids, this.remove, this)
	}
}

export default StudySet

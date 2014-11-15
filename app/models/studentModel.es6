'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
import {Emitter} from 'event-kit'
import events from '../helpers/events.es6'

import uuid from '../helpers/uuid.es6'
import randomChar from '../helpers/randomChar.es6'
import db from '../helpers/db.es6'
import countCredits from '../helpers/countCredits.es6'

import ScheduleSet from './scheduleSet.es6'
import StudySet from './studySet.es6'

import * as demoStudent from '../../mockups/demo_student.json'

class Student {
	constructor(encodedStudent={}) {
		this._emitter = new Emitter
		this.onDidChange(this.save.bind(this))

		this.isLoaded =  Promise.pending();
		this.isLoaded.promise.then(() => console.log('Student.isLoaded => done!'))

		this._init(encodedStudent)
	}

	_init(encodedStudent) {
		this._id = encodedStudent._id || encodedStudent.id || uuid()
		this._name = encodedStudent._name || encodedStudent.name || 'Student ' + randomChar()
		this._active = encodedStudent._active || encodedStudent.active || false

		this._creditsNeeded = encodedStudent._creditsNeeded || encodedStudent.creditsNeeded || (encodedStudent.credits ? encodedStudent.credits.needed : undefined)
		if (this._creditsNeeded === undefined)
			this._creditsNeeded = 35

		this._matriculation = encodedStudent._matriculation || encodedStudent.matriculation || 1894
		this._graduation = encodedStudent._graduation || encodedStudent.graduation || 1898

		this._studies = new StudySet(encodedStudent._studies || encodedStudent.studies)
		this._schedules = new ScheduleSet(encodedStudent._schedules || encodedStudent.schedules)
		this._overrides = encodedStudent._overrides || encodedStudent.overrides || []
		this._fabrications = encodedStudent._fabrications || encodedStudent.fabrications || []

		this._studies.onDidChange(this._emitChange.bind(this))
		this._schedules.onDidChange(this._emitChange.bind(this))

		this.isLoaded.fulfill()
	}

	// EventEmitter Helpers

	_emitChange() {
		this._emitter.emit(events.didChange)
	}

	onDidChange(callback) {
		return this._emitter.on(events.didChange, callback)
	}


	// properties

	get id() { return this._id; }
	set id(newId) {
		this._id = newId;
		this._emitChange();
	}

	get name() { return this._name; }
	set name(newName) {
		this._name = newName;
		this._emitChange();
	}

	get active() { return this._active; }
	set active(isActive) {
		this._active = isActive;
		this._emitChange();
	}

	get creditsNeeded() { return this._creditsNeeded; }
	set creditsNeeded(newCreditsNeeded) {
		this._creditsNeeded = newCreditsNeeded;
		this._emitChange();
	}

	get matriculation() { return this._matriculation; }
	set matriculation(newMatriculation) {
		this._matriculation = newMatriculation;
		this._emitChange();
	}

	get graduation() { return this._graduation; }
	set graduation(newGraduation) {
		this._graduation = newGraduation;
		this._emitChange();
	}

	get studies() { return this._studies; }
	get schedules() { return this._schedules; }
	get overrides() { return this._overrides; }
	get fabrications() { return this._fabrications; }


	// getters

	get courses() {
		return this.schedules.activeCourses
	}

	get creditCount() {
		return countCredits(this.courses)
	}


	// helpers

	encode() {
		return encodeURIComponent(this)
	}

	toString() {
		return JSON.stringify(this)
	}

	save() {
		console.log('saving student', this.name, '(' + this.id + ')')
		localStorage.setItem(this.id, this)
		// return db.store('students').put(this)
	}
}

function loadStudentFromDb(opts) {
	opts = opts || {}

	let rawStudent;

	if (!opts.fromDb) {
		let localStudent = localStorage.getItem('3AE9E7EE-DA8F-4014-B987-8D88814BB848')
		rawStudent = JSON.parse(localStudent)
	}

	if (!rawStudent)
		rawStudent = demoStudent

	let student = new Student(rawStudent)
	window.student = student

	return student
}

let revertStudentToDemo = () => loadStudentFromDb({fromDb: true})

export default Student
export {Student, loadStudentFromDb, revertStudentToDemo}

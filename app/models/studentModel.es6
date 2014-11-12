'use strict';

import * as _ from 'lodash'

import uuid from '../helpers/uuid'
import randomChar from '../helpers/randomChar'
import emitter from '../helpers/emitter'
import db from '../helpers/db'

import ScheduleSet from './scheduleSet'
import StudySet from './studySet'

import * as demoStudent from '../../mockups/demo_student.json'

let Student = (encodedStudent) => {
	encodedStudent = encodedStudent || {}

	let student = {
		id: uuid(),
		name: 'Student ' + randomChar(),
		active: false,

		credits: { needed: 35, has: 0 },

		matriculation: 1894,
		graduation: 1898,

		studies: {},
		schedules: {},
		overrides: [],
		fabrications: [],
	}

	student.id = encodedStudent.id || student.id
	student.name = encodedStudent.name || student.name
	student.active = encodedStudent.active || student.active

	if (encodedStudent.credits)
		student.credits.needed = encodedStudent.credits.needed || student.credits.needed

	student.matriculation = encodedStudent.matriculation || student.matriculation
	student.graduation = encodedStudent.graduation || student.graduation

	student.studies   = new StudySet(encodedStudent.studies || student.studies)
	student.schedules = new ScheduleSet(encodedStudent.schedules || student.schedules)
	student.overrides = encodedStudent.overrides || student.overrides
	student.fabrications = encodedStudent.fabrications || student.fabrications

	Object.observe(student, (changes) => emitter.emit('change'))

	Object.defineProperty(student, 'courses', { get() {
		return this.schedules.activeCourses
	}})

	Object.defineProperty(student, 'encode', { value() {
		return encodeURIComponent(JSON.stringify(this))
	}})

	Object.defineProperty(student, 'save', { value() {
		console.log('saving student', this.name)
		localStorage.setItem(this.id, JSON.stringify(student))
		// return db.store('students').put(this)
	}})

	emitter.on('saveStudent', student.save)

	// todo: remove me when we have something more than tape.
	// for one thing, i'm pretty sure that all these emitters are causing some
	// level of a memory leak.
	emitter.on('change', student.save)

	return student
}

function loadStudentFromDb(opts) {
	opts = opts || {}

	let rawStudent;
	if (!opts.fromDb) {
		rawStudent = localStorage.getItem('3AE9E7EE-DA8F-4014-B987-8D88814BB848')
		// again, ick. reassignment.
		rawStudent = JSON.parse(rawStudent)
	}
	if (!rawStudent)
		rawStudent = demoStudent

	let student = new Student(rawStudent)
	window.student = student

	emitter.emit('loadedStudent', student)
	return student
}

emitter.on('revertStudentToDemo', () => loadStudentFromDb({fromDb: true}))

emitter.on('loadStudent', loadStudentFromDb)
window.loadStudentFromDb = loadStudentFromDb

export default Student
export {loadStudentFromDb, Student}

'use strict';

import * as _ from 'lodash'

import uuid from '../helpers/uuid'
import randomChar from '../helpers/randomChar'
import emitter from '../helpers/emitter'
import db from '../helpers/db'

import ScheduleSet from './scheduleSet'
import StudySet from './studySet'

let Student = (encodedStudent) => {
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

	Object.defineProperty(student, 'courses', { get() {
		return student.schedules.activeCourses
	}})

	Object.defineProperty(student, 'encode', { value() {
		return JSON.stringify(student)
	}})

	Object.defineProperty(student, 'save', { value() {
		console.log('saving student', student.name)
		return db.store('students').put(student)
	}})

	emitter.on('save', () => db.store('students').put(student))
	// emitter.on('change', student.save)

	student.id = encodedStudent.id || student.id
	student.name = encodedStudent.name || student.name

	if (encodedStudent.credits)
		student.credits.needed = encodedStudent.credits.needed || student.credits.needed

	student.matriculation = encodedStudent.matriculation || student.matriculation
	student.graduation = encodedStudent.graduation || student.graduation

	student.studies   = new StudySet(encodedStudent.studies || student.studies)
	student.schedules = new ScheduleSet(encodedStudent.schedules || student.schedules)
	student.overrides = encodedStudent.overrides || student.overrides
	student.fabrications = encodedStudent.fabrications || student.fabrications

	return student
}

export default Student

import * as Promise from 'bluebird'
import * as Immutable from 'immutable'

import uuid from '../helpers/uuid.es6'
import randomChar from '../helpers/randomChar.es6'
import countCredits from '../helpers/countCredits.es6'

import ScheduleSet from './scheduleSet.es6'
import StudySet from './studySet.es6'

import * as demoStudent from '../../mockups/demo_student.json'

let currentVersionString = '3.0.0alpha8'

let StudentRecord = Immutable.Record({
	id: uuid(),
	name: 'Student ' + randomChar(),
	active: false,
	version: currentVersionString,

	creditsNeeded: 35,

	matriculation: 1894,
	graduation: 1898,

	studies: Immutable.List(),
	schedules: Immutable.List(),
	overrides: Immutable.List(),
	fabrications: Immutable.List(),
})

class Student extends StudentRecord {
	constructor(encodedStudent={}) {
		this.isLoaded =  Promise.pending();
		this.isLoaded.promise.then(() => console.log('Student.isLoaded => done!'))

		Immutable.Seq(encodedStudent.studies || []).forEach(this.addArea, this)
		Immutable.Seq(encodedStudent.schedules || []).forEach(this.addSchedule, this)
		Immutable.Seq(encodedStudent.overrides || []).forEach(this.addOverride, this)
		Immutable.Seq(encodedStudent.fabrications || []).forEach(this.addFabrication, this)

		this.isLoaded.fulfill()
	}

	rename(newName) {
		return this.set('name', newName)
	}

	changeActive(isActive) {
		return this.set('active', isActive)
	}

	changeCreditsNeeded(newCreditsNeeded) {
		return this.set('creditsNeeded', newCreditsNeeded)
	}

	changeMatriculation(newMatriculation) {
		return this.set('matriculation', newMatriculation)
	}

	changeGraduation(newGraduation) {
		return this.set('graduation', newGraduation)
	}


	// schedule methods

	get schedulesByYear() {
		return this.schedules.groupBy((sched) => sched.year)
	}

	get activeSchedules() {
		return this.schedules.filter((sched) => sched.active === true)
	}

	addSchedule(newSchedule) {
		let sched = new Schedule(schedule)
		return this.set('schedules', this.schedules.push(sched))
	}

	destroySchedule(scheduleId) {
		console.log(`removing schedule ${scheduleId}`)

		let deadSched = this.schedules.find((sched) => sched.scheduleId === scheduleId)
		let deadSchedIndex = this.schedules.findIndex((sched) => sched.scheduleId === scheduleId)

		this.schedules = this.schedules.delete(deadSchedIndex)

		if (deadSched.active) {
			let otherSchedIndex = this.schedules.findIndex((sched) => {
				return sched.year === deadSched.year && sched.semester === deadSched.semester
			})
			if (otherSchedIndex)
				this.schedules = this.schedules.setIn([otherSchedIndex, 'active'], true)
		}
	}

	destroyMultipleSchedules(ids) {
		Seq(ids).forEach(this.destroySchedule, this)
	}

	// area-of-study methods

	get areasByType() {
		return this.studies.groupBy((study) => study.type)
	}

	addArea(areaOfStudy) {
		let study = new Study(areaOfStudy)
		this.studies = this.studies.push(study)
	}

	removeArea(id) {
		let removedIndex = this.studies.findIndex((study) => study.id === id)
		this.studies = this.studies.delete(removedIndex)
	}

	removeMultipleAreas(ids) {
		Seq(ids).forEach(this.removeArea, this)
	}


	// getters

	get courses() {
		return this.activeSchedules
			.map((schedule) => schedule.courses)
			.flatten()
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

	toJSON() {
		return JSON.stringify(this.data)
	}

	save() {
		console.log('saving student', this.name, '(' + this.id + ')')
		localStorage.setItem(this.id, this)

		if (this.data.get('active'))
			localStorage.setItem('activeStudentId', this.data.id)
	}
}

function loadStudentFromDb(opts) {
	opts = opts || {}

	let rawStudent;
	let studentId = localStorage.getItem('activeStudentId')
	let demoStudentId = '3AE9E7EE-DA8F-4014-B987-8D88814BB848'

	let localStudent = localStorage.getItem(studentId || demoStudentId) || localStorage.getItem(`student-${currentVersionString}`)

	try {
		rawStudent = JSON.parse(localStudent)
	}
	catch (e) {
		console.info('using demo student')
		rawStudent = demoStudent
		rawStudent.active = true
		rawStudent.id = null
	}

	if (opts.demo) {
		console.log('reverting to demo student')
		rawStudent = demoStudent
		rawStudent.active = true
		rawStudent.id = null
	}

	let student = new Student(rawStudent)
	window.student_data = student

	student.save()

	return student
}

let revertStudentToDemo = () => loadStudentFromDb({demo: true})

export default Student
export {Student, loadStudentFromDb, revertStudentToDemo}

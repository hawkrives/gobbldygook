import * as Promise from 'bluebird'
import * as Immutable from 'immutable'

import uuid from 'helpers/uuid'
import randomChar from 'helpers/randomChar'
import countCredits from 'helpers/countCredits'

import Schedule from 'models/schedule'
import Study from 'models/study'

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
		let filtered = Immutable.fromJS(encodedStudent)
			.filter((val, key) => ['studies', 'schedules', 'overrides', 'fabrications'].indexOf(key) === -1)

		super(filtered.toJS())
		console.log(encodedStudent, filtered.toJS())

		if (encodedStudent) {
			return this.withMutations((student) => {
				Immutable.Seq(encodedStudent.studies || [])
					.forEach((study) => {
						student = student.addArea(study)
					})

				Immutable.Seq(encodedStudent.schedules || [])
					.forEach((schedule) => {
						student = student.addSchedule(schedule)
					})

				Immutable.Seq(encodedStudent.overrides || [])
					.forEach((override) => {
						student = student.addOverride(override)
					})

				Immutable.Seq(encodedStudent.fabrications || [])
					.forEach((fabrication) => {
						student = student.addFabrication(fabrication)
					})

				return student
			})
		}
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
		let sched = new Schedule(newSchedule)
		return this.set('schedules', this.schedules.push(sched))
	}

	destroySchedule(scheduleId) {
		console.log(`removing schedule ${scheduleId}`)

		let deadSched = this.schedules.find((sched) => sched.scheduleId === scheduleId)
		let deadSchedIndex = this.schedules.findIndex((sched) => sched.scheduleId === scheduleId)

		let scheduleIsNoMore = this.set('schedules', this.schedules.delete(deadSchedIndex))

		if (deadSched.active) {
			let otherSchedIndex = this.schedules.findIndex((sched) => {
				return sched.year === deadSched.year && sched.semester === deadSched.semester
			})
			if (otherSchedIndex)
				return scheduleIsNoMore.set('schedules', scheduleIsNoMore.setIn([otherSchedIndex, 'active'], true))
		}
		else {
			return scheduleIsNoMore
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
		return this.set('studies', this.studies.push(study))
	}

	removeArea(id) {
		let removedIndex = this.studies.findIndex((study) => study.id === id)
		return this.set('studies', this.studies.delete(removedIndex))
	}

	removeMultipleAreas(ids) {
		Seq(ids).forEach(this.removeArea, this)
	}

	// misc

	addOverride(override) {
		return this
	}

	addFabrication(fabrication) {
		return this
	}


	// getters

	get courses() {
		let scheduleCoursePromises = Promise.all(this.activeSchedules.map((schedule) => schedule.courses))
		return scheduleCoursePromises
			.then((courses) => courses.flatten())
	}

	get creditCount() {
		return countCredits(this.courses)
	}


	// helpers

	encode() {
		return encodeURIComponent(this)
	}

	toString() {
		return JSON.stringify(this.toJS())
	}

	toJSON() {
		return JSON.stringify(this.toJS())
	}

	save() {
		console.log('saving student', this.name, '(' + this.id + ')')
		localStorage.setItem(this.id, this.toJSON())

		if (this.active)
			localStorage.setItem('activeStudentId', this.id)
	}
}

export default Student

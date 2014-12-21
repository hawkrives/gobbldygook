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

	studies: Immutable.Map(),
	schedules: Immutable.Map(),
	overrides: Immutable.Map(),
	fabrications: Immutable.Map(),
})

class Student extends StudentRecord {
	constructor(encodedStudent={}) {
		let filtered = Immutable.fromJS(encodedStudent)
			.filter((val, key) => ['studies', 'schedules', 'overrides', 'fabrications'].indexOf(key) === -1)

		super(filtered.toJS())
		// console.log(encodedStudent, filtered.toJS())

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
		return this.schedules.groupBy(sched => sched.year)
	}

	get activeSchedules() {
		return this.schedules.filter(sched => sched.active).sortBy(sched => sched.semester)
	}

	addSchedule(newSchedule) {
		let sched = new Schedule(newSchedule)
		return this.setIn(['schedules', sched.id], sched)
	}

	destroySchedule(scheduleId) {
		console.log(`removing schedule ${scheduleId}`)

		let deadSched = this.getIn(['schedules', scheduleId])
		let scheduleIsNoMore = this.set('schedules', this.schedules.delete(scheduleId))

		if (deadSched && deadSched.active) {
			let otherSchedKey = this.schedules.findKey((sched) => sched.year === deadSched.year && sched.semester === deadSched.semester)
			if (otherSchedKey) {
				return scheduleIsNoMore.setIn(['schedules', otherSchedKey, 'active'], true)
			}
		}
		return scheduleIsNoMore
	}

	destroyMultipleSchedules(ids) {
		return this.withMutations((student) => {
			Immutable.Seq(ids).forEach((id) => {
				console.log('destroyMultipleSchedules', id)
				student = student.destroySchedule(id)
			})
			return student
		})
	}

	// area-of-study methods

	get areasByType() {
		return this.studies.groupBy((study) => study.type)
	}

	addArea(areaOfStudy) {
		let study = new Study(areaOfStudy)
		return this.setIn(['studies', study.id], study)
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
		let courses = this.activeSchedules.map((schedule) => schedule.courses)
		let scheduleCoursePromises = Promise.all(courses)
		return scheduleCoursePromises.then((courses) => courses.flatten(true))
	}

	get creditCount() {
		return this.courses.then(countCredits)
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

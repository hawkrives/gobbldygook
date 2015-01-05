import * as Promise from 'bluebird'
import * as Immutable from 'immutable'
import * as _ from 'lodash'

import uuid from 'app/helpers/uuid'
import randomChar from 'app/helpers/randomChar'
import countCredits from 'app/helpers/countCredits'

import Schedule from 'app/models/schedule'
import Study from 'app/models/study'

import * as demoStudent from 'sto-areas/demo_student.json'

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

	settings: Immutable.Map(),
})

class Student extends StudentRecord {
	constructor(encodedStudent={}) {
		// Don't pass the list params into the StudentRecord constructor; it creates them as JS objects,
		// instead of our custom Studies, Schedules, and such.
		let toRemove = Immutable.Set(['studies', 'schedules', 'overrides', 'fabrications'])
		let filtered = Immutable.fromJS(encodedStudent).filterNot((val, key) => toRemove.has(key))

		super(filtered)

		// Then add them manually.
		if (encodedStudent) {
			return this.withMutations((student) => {
				Immutable.Seq(encodedStudent.studies || [])
					.forEach(study => { student = student.addArea(study) })

				Immutable.Seq(encodedStudent.schedules || [])
					.forEach(schedule => { student = student.addSchedule(schedule) })

				Immutable.Seq(encodedStudent.overrides || [])
					.forEach(override => { student = student.addOverride(override) })

				Immutable.Seq(encodedStudent.fabrications || [])
					.forEach(fabrication => { student = student.addFabrication(fabrication) })

				return student
			})
		}
	}

	changeName(newName) {
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

	changeSetting(key, value) {
		return this.setIn(['settings', key], value)
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
			let otherSchedKey = this.schedules.findKey((sched) =>
				sched.year === deadSched.year && sched.semester === deadSched.semester)

			if (otherSchedKey) {
				return scheduleIsNoMore.setIn(['schedules', otherSchedKey, 'active'], true)
			}
		}
		return scheduleIsNoMore
	}

	destroyMultipleSchedules(ids) {
		return this.withMutations((student) => {
			console.groupCollapsed('destroyMultipleSchedules')
			Immutable.Seq(ids).forEach((id) => {
				console.log('destroyMultipleSchedules', id)
				student = student.destroySchedule(id)
			})
			console.groupEnd('destroyMultipleSchedules')
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
		return this.set('studies', this.studies.delete(id))
	}

	removeMultipleAreas(ids) {
		Seq(ids).forEach(this.removeArea, this)
	}


	// override methods

	addOverride(override) {
		return this.setIn(['overrides', override.id], override)
	}

	removeOverride(overrideId) {
		return this.set('overrides', this.overrides.delete(overrideId))
	}


	// fabrication methods

	addFabrication(fabrication) {
		return this.setIn(['fabrications', fabrication.id], fabrication)
	}

	removeFabrication(fabricationId) {
		return this.set('fabrications', this.fabrications.delete(fabricationId))
	}


	// getters

	get courses() {
		let allCourses = this.activeSchedules.map((schedule) => schedule.courses).toArray()
		let scheduleCoursePromises = Promise.all(allCourses)
		return scheduleCoursePromises.then((results) => _.flatten(results))
	}

	get creditCount() {
		return this.courses.then(countCredits)
	}


	// helpers

	data() {
		return Promise.props({
			courses: this.courses,
			fabrications: this.fabrications.toList().toJS(),
			overrides: this.overrides.toList().toJS(),
			studies: this.studies.toList().toJS(),
			creditsNeeded: this.creditsNeeded,
			graduation: this.graduation,
			matriculation: this.matriculation,
		})
	}

	encode() {
		return encodeURIComponent(this.toJS())
	}

	toString() {
		return JSON.stringify(this.toJS())
	}

	toJSON() {
		return JSON.stringify(this.toJS())
	}

	save() {
		console.log(`saving student ${this.name} (${this.id})`)
		localStorage.setItem(this.id, this.toJSON())

		if (this.active)
			localStorage.setItem('activeStudentId', this.id)
	}
}

export default Student

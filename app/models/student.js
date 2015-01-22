import Promise from 'bluebird'
import Immutable from 'immutable'
import {flatten, forEach, contains} from 'lodash'
import {v4 as uuid} from 'node-uuid'

import {version as currentVersionString} from '../../package.json'

import randomChar from 'sto-helpers/lib/randomChar'
import countCredits from 'sto-helpers/lib/countCredits'

import Schedule from './schedule'
import Study from './study'


let StudentRecord = Immutable.Record({
	id: uuid(),
	name: 'Student ' + randomChar(),
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
		// let startTime = performance.now()
		// Don't pass the list params into the StudentRecord constructor; it creates them as JS objects,
		// instead of our custom Studies, Schedules, and such.
		let toRemove = ['studies', 'schedules', 'overrides', 'fabrications']
		let immutableStudent = Immutable.fromJS(encodedStudent) || Immutable.Map()
		let filtered = immutableStudent.filterNot((val, key) => contains(toRemove, key))

		super(filtered)

		// Then add them manually.
		if (encodedStudent) {
			return this.withMutations((student) => {
				student = student.set('id', encodedStudent.id || uuid())
				student = student.set('name', encodedStudent.name || 'Student ' + randomChar())

				forEach((encodedStudent.studies || []), study => {
					student = student.addArea(study)
				})

				forEach((encodedStudent.schedules || []), schedule => {
					student = student.addSchedule(schedule)
				})

				forEach((encodedStudent.overrides || []), override => {
					student = student.addOverride(override)
				})

				forEach((encodedStudent.fabrications || []), fabrication => {
					student = student.addFabrication(fabrication)
				})

				student = student.set('version', currentVersionString)

				// console.log('it took', performance.now() - startTime, 'ms to make a student')

				return student
			})
		}
	}

	changeName(newName) {
		return this.set('name', newName)
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
		// console.log(`removing schedule ${scheduleId}`)

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
			// console.groupCollapsed('destroyMultipleSchedules')
			Immutable.Seq(ids).forEach((id) => {
				// console.log('destroyMultipleSchedules', id)
				student = student.destroySchedule(id)
			})
			// console.groupEnd('destroyMultipleSchedules')
			return student
		})
	}

	moveCourse(fromScheduleId, toScheduleId, clbid) {
		// console.log(`moving course ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)
		return this.withMutations((student) => {
			student = student.setIn(['schedules', fromScheduleId], student.getIn(['schedules', fromScheduleId]).removeCourse(clbid))
			student = student.setIn(['schedules', toScheduleId], student.getIn(['schedules', toScheduleId]).addCourse(clbid))
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
		return this.setIn(['overrides', override.what], override)
	}

	removeOverride(thingOverriden) {
		return this.set('overrides', this.overrides.delete(thingOverriden))
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
		return scheduleCoursePromises.then((results) => flatten(results))
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
		return encodeURIComponent(JSON.stringify(this))
	}

	save() {
		console.log(`saving student ${this.name} (${this.id})`)
		localStorage.setItem(this.id, JSON.stringify(this))
	}
}

export default Student

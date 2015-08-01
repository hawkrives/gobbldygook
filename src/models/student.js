import Promise from 'bluebird'
import Immutable from 'immutable'
import flatten from 'lodash/array/flatten'
import forEach from 'lodash/collection/forEach'
import omit from 'lodash/object/omit'
import {v4 as uuid} from 'node-uuid'
import stringify from 'json-stable-stringify'

import {version as currentVersionString} from '../../package.json'

import {randomChar, countCredits} from 'sto-helpers'

import Schedule from './schedule'
import Study from './study'

import checkStudentGraduatability from '../helpers/checkStudentGraduatability'

import present from 'present'
import debug from 'debug'
const changelog = debug('gobbldygook:model:student:changes')

const now = new Date()
const StudentRecord = Immutable.Record({
	id: null,
	name: null,
	version: currentVersionString,

	creditsNeeded: 35,

	matriculation: now.getFullYear() - 2,
	graduation: now.getFullYear() + 2,
	advisor: '',

	dateLastModified: null,
	dateCreated: null,

	studies: Immutable.OrderedMap(),
	schedules: Immutable.OrderedMap(),
	overrides: Immutable.OrderedMap(),
	fabrications: Immutable.OrderedMap(),

	settings: Immutable.Map(),
})

export default class Student extends StudentRecord {
	constructor(encodedStudent={}) {
		const startTime = present()

		// Don't pass the list params into the StudentRecord constructor;
		// it creates them as JS objects, instead of our custom records.
		const toRemove = ['studies', 'schedules', 'overrides', 'fabrications', 'settings']
		const filtered = omit(encodedStudent, toRemove)
		const immutableStudent = Immutable.fromJS(filtered)

		super(immutableStudent)

		// Then add them manually.
		if (encodedStudent) {
			return this.withMutations((student) => {
				student = student.set('id', encodedStudent.id || uuid())
				student = student.set('name', encodedStudent.name || 'Student ' + randomChar())
				student = student.set('dateCreated', encodedStudent.dateCreated || new Date())
				student = student.set('dateLastModified', encodedStudent.dateLastModified || new Date())
				student = student.set('version', currentVersionString)

				forEach((encodedStudent.studies || []), study => {
					student = student.addArea(study)
				})

				forEach((encodedStudent.schedules || []), schedule => {
					student = student.addSchedule(schedule)
				})

				student = student.addOverride(encodedStudent.overrides || {})

				forEach((encodedStudent.fabrications || []), fabrication => {
					student = student.addFabrication(fabrication)
				})

				forEach((encodedStudent.settings || {}), (value, key) => {
					student = student.changeSetting(key, value)
				})

				changelog(`it took ${present() - startTime} ms to make a student`)

				return student
			})
		}
	}

	changeName(newName) {
		return this.set('name', newName)
	}

	changeAdvisor(newAdvisor) {
		return this.set('advisor', newAdvisor)
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

	get graduatability() {
		return checkStudentGraduatability(this)
	}


	// schedule methods

	get schedulesByYear() {
		return this.schedules
			.groupBy(sched => sched.year)
	}

	get activeSchedules() {
		return this.schedules
			.filter(sched => sched.active)
			.sortBy(sched => sched.semester)
	}

	addSchedule(newSchedule) {
		const sched = new Schedule(newSchedule)
		return this.setIn(['schedules', sched.id], sched)
	}

	destroySchedule(scheduleId) {
		changelog(`removing schedule ${scheduleId}`)

		const deadSched = this.getIn(['schedules', scheduleId])
		const scheduleIsNoMore = this.set('schedules', this.schedules.delete(scheduleId))

		if (deadSched && deadSched.active) {
			const otherSchedKey = scheduleIsNoMore.findKey((sched) =>
				sched.year === deadSched.year &&
				sched.semester === deadSched.semester &&
				sched.id !== deadSched.id)

			if (otherSchedKey) {
				return scheduleIsNoMore.setIn(['schedules', otherSchedKey, 'active'], true)
			}
		}
		return scheduleIsNoMore
	}

	destroyMultipleSchedules(ids) {
		return this.withMutations((student) => {
			changelog('destroyMultipleSchedules', ids)
			// console.groupCollapsed('destroyMultipleSchedules')
			forEach('toArray' in ids ? ids.toArray() : ids, (id) => {
				student = student.destroySchedule(id)
			})
			// console.groupEnd('destroyMultipleSchedules')
			return student
		})
	}

	moveCourse(fromScheduleId, toScheduleId, clbid) {
		changelog(`moving course ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)
		return this.withMutations((student) => {
			student = student.setIn(['schedules', fromScheduleId], student.getIn(['schedules', fromScheduleId]).removeCourse(clbid))
			student = student.setIn(['schedules', toScheduleId], student.getIn(['schedules', toScheduleId]).addCourse(clbid))
		})
	}


	// area-of-study methods

	get areasByType() {
		return this.studies.groupBy(study => study.type || 'Unknown')
	}

	addArea(areaOfStudy) {
		const study = new Study(areaOfStudy)
		return this.setIn(['studies', study.id], study)
	}

	removeArea(id) {
		return this.set('studies', this.studies.delete(id))
	}

	removeMultipleAreas(ids) {
		return this.withMutations((student) => {
			forEach(ids.hasOwnProperty('toArray') ? ids.toArray() : ids, id => {
				student = student.removeArea(id)
			})
			return student
		})
	}


	// override methods

	addOverride(overrideObj) {
		return this.withMutations(student => {
			forEach(overrideObj, (val, key) => {
				student = student.setIn(['overrides', key], val)
			})
			return student
		})
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
		const allCourses = this.activeSchedules
			.map((schedule) => schedule.courses)
			.toArray()
		const scheduleCoursePromises = Promise.all(allCourses)
		return scheduleCoursePromises.then((scheduleCourses) => flatten(scheduleCourses))
	}

	get creditCount() {
		return this.courses.then(countCredits)
	}


	// helpers

	data() {
		return Promise.props({
			courses: this.courses,
			creditsNeeded: this.creditsNeeded,
			fabrications: this.fabrications.toList().toJS(),
			graduation: this.graduation,
			matriculation: this.matriculation,
			overrides: this.overrides.toList().toJS(),
			studies: this.studies.toList().toJS(),
		})
	}

	encode() {
		return encodeURIComponent(stringify(this))
	}

	save() {
		// grab the old (still-JSON-encoded) student from localstorage
		// compare it to the current one
		// if they're different, update dateLastModified, stringify, and save.
		const oldVersion = localStorage.getItem(this.id)
		if (oldVersion !== stringify(this)) {
			changelog(`saving student ${this.name} (${this.id})`)
			const student = this.set('dateLastModified', new Date())
			localStorage.setItem(student.id, stringify(student))
		}
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			version: this.version,
			creditsNeeded: this.creditsNeeded,
			matriculation: this.matriculation,
			graduation: this.graduation,
			studies: this.studies.toList(),
			schedules: this.schedules.toList(),
			overrides: this.overrides.toMap(),
			fabrications: this.fabrications.toList(),
			settings: this.settings.toMap(),
		}
	}
}

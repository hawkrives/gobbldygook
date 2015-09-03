import Immutable from 'immutable'
import flatten from 'lodash/array/flatten'
import forEach from 'lodash/collection/forEach'
import omit from 'lodash/object/omit'
import uniq from 'lodash/array/uniq'
import {v4 as uuid} from 'node-uuid'
import stringify from 'json-stable-stringify'
import present from 'present'

import {version as currentVersionString} from '../../package.json'
import {studentChangelog as changelog} from '../lib/logger'
import checkGraduatability from '../lib/check-student-graduatability'

import randomChar from '../helpers/random-char'

import Schedule from './schedule'
import Study from './study'

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

	graduatability: Promise.resolve({
		canGraduate: false,
		studyResults: Immutable.OrderedMap(),
	}),
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
			return this.withMutations(student => {
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

				student = student.setOverride(encodedStudent.overrides || {})

				forEach((encodedStudent.fabrications || []), fabrication => {
					student = student.addFabrication(fabrication)
				})

				forEach((encodedStudent.settings || {}), (value, key) => {
					student = student.changeSetting(key, value)
				})

				student.set('graduatability', checkGraduatability(student))

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

	checkGraduatability() {
		return this.set('graduatability', checkGraduatability(this))
	}


	// schedule methods

	addSchedule(newSchedule) {
		const sched = new Schedule(newSchedule)
		return this.setIn(['schedules', sched.id], sched)
	}

	destroySchedule(scheduleId) {
		changelog(`removing schedule ${scheduleId}`)

		const deadSched = this.getIn(['schedules', scheduleId])
		const scheduleIsNoMore = this.set('schedules', this.schedules.delete(scheduleId))

		if (deadSched && deadSched.active) {
			const otherSchedKey = scheduleIsNoMore.findKey(sched =>
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
		return this.withMutations(student => {
			changelog('destroyMultipleSchedules', ids)
			// console.groupCollapsed('destroyMultipleSchedules')
			forEach('toArray' in ids ? ids.toArray() : ids, id => {
				student = student.destroySchedule(id)
			})
			// console.groupEnd('destroyMultipleSchedules')
			return student
		})
	}

	moveCourse(fromScheduleId, toScheduleId, clbid) {
		changelog(`moving course ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)
		return this.withMutations(student => {
			student = student.setIn(['schedules', fromScheduleId], student.getIn(['schedules', fromScheduleId]).removeCourse(clbid))
			student = student.setIn(['schedules', toScheduleId], student.getIn(['schedules', toScheduleId]).addCourse(clbid))
		})
	}


	// area-of-study methods

	addArea(areaOfStudy) {
		const study = new Study(areaOfStudy)
		return this.setIn(['studies', study.id], study)
	}

	removeArea(id) {
		return this.set('studies', this.studies.delete(id))
	}

	removeMultipleAreas(ids) {
		return this.withMutations(student => {
			forEach(ids.hasOwnProperty('toArray') ? ids.toArray() : ids, id => {
				student = student.removeArea(id)
			})
			return student
		})
	}


	// override methods

	setOverride(overrideObj) {
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
		const allCourses = this.schedules
			.filter(sched => sched.active)
			.map(schedule => schedule.courses)
			.toArray()

		const scheduleCoursePromises = Promise.all(allCourses)
		return scheduleCoursePromises.then(scheduleCourses => uniq(flatten(scheduleCourses), course => course.clbid))
	}


	// helpers

	data() {
		return Promise.all([
			this.courses, // 0
			this.creditsNeeded, // 1
			this.fabrications.toList().toJS(), // 2
			this.graduation, // 3
			this.matriculation, // 4
			this.overrides.toObject(), // 5
			this.studies.toList().toJS(), // 6
			this.graduatability, // 7
		]).then(results => ({
			courses: results[0],
			creditsNeeded: results[1],
			fabrications: results[2],
			graduation: results[3],
			matriculation: results[4],
			overrides: results[5],
			studies: results[6],
			studyResults: results[7].details,
			graduatability: results[7].canGraduate,
		}))
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
			overrides: this.overrides,
			fabrications: this.fabrications.toList(),
			settings: this.settings,
		}
	}
}

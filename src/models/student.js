import Immutable from 'immutable'
import flatten from 'lodash/array/flatten'
import forEach from 'lodash/collection/forEach'
import omit from 'lodash/object/omit'
import uniq from 'lodash/array/uniq'
import round from 'lodash/math/round'
import {v4 as uuid} from 'uuid'
import stringify from 'json-stable-stringify'
import present from 'present'
const debug = require('debug')('gobbldygook:models')

import checkGraduatability from '../helpers/check-student-graduatability'

import randomChar from '../helpers/random-char'

import Schedule from './schedule'
import Study from './study'

export async function getStudentData(student) {
	const courses = await student.courses

	return {
		courses: courses,
		creditsNeeded: student.creditsNeeded,
		fabrications: student.fabrications.toList().toJS(),
		graduation: student.graduation,
		matriculation: student.matriculation,
		overrides: student.overrides.toObject(),
	}
}

const now = new Date()
const StudentRecord = Immutable.Record({
	id: null,
	name: null,
	version: VERSION,

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
				student = student.set('version', VERSION)

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

				debug(`Student(): it took ${round(present() - startTime, 2)} ms to make a student`)

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
		debug(`Student.destroySchedule(): removing schedule ${scheduleId}`)

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
			debug('Student.destroyMultipleSchedules():', ...ids)
			ids.forEach(id => {
				student = student.destroySchedule(id)
			})
			return student
		})
	}

	moveCourse(fromScheduleId, toScheduleId, clbid) {
		debug(`Student.moveCourse(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)
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

	editArea(areaId, newSource) {
		return this.withMutations(student => {
			let studies = student.studies
			let area = studies.get(areaId)
			area = area.edit(newSource)

			studies = studies.delete(areaId)
			studies = studies.set(area.id, area)

			return student.set('studies', studies)
		})
	}

	removeArea(id) {
		return this.set('studies', this.studies.delete(id))
	}

	removeMultipleAreas(ids) {
		return this.withMutations(student => {
			ids.forEach(id => {
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
		// - At it's core, this method just needs to get the list of courses that a student has chosen.
		// - Each schedule has a list of courses that are a part of that schedule.
		// - Additionally, we only care about the schedules that are marked as "active".
		// - Keep in mind that each list of courses is actually a *promise* for the courses.
		// - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
		// - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
		//   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.

		const start = present()

		const activeSchedules = this.schedules.filter(s => s.active)
		const promisesForCourses = activeSchedules.map(s => s.courses).toArray()

		return Promise.all(promisesForCourses)
			.then(courses => {
				debug(`Student(${this.id}).courses: it took ${round(present() - start, 2)} ms to fetch`)
				return uniq(flatten(courses), course => course.clbid)
			})
			.catch(err => console.error(err))
	}


	// helpers

	encode() {
		return encodeURIComponent(stringify(this))
	}

	save() {
		// grab the old (still JSON-encoded) student from localstorage
		// compare it to the current one
		// if they're different, update dateLastModified, stringify, and save.
		const oldVersion = localStorage.getItem(this.id)

		if (oldVersion !== stringify(this)) {
			debug(`saving student ${this.name} (${this.id})`)

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

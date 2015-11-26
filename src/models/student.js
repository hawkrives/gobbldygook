import contains from 'lodash/collection/contains'
import filter from 'lodash/collection/filter'
import findIndex from 'lodash/array/findIndex'
import findKey from 'lodash/object/findKey'
import findWarnings from '../helpers/find-course-warnings'
import flatten from 'lodash/array/flatten'
import identity from 'lodash/utility/identity'
import isNumber from 'lodash/lang/isNumber'
import isTrue from '../helpers/is-true'
import isUndefined from 'lodash/lang/isUndefined'
import localStorage from '../helpers/localstorage'
import omit from 'lodash/object/omit'
import pluck from 'lodash/collection/pluck'
import present from 'present'
import reject from 'lodash/collection/reject'
import round from 'lodash/math/round'
import some from 'lodash/collection/some'
import stringify from 'json-stable-stringify'
import uniq from 'lodash/array/uniq'
import {v4 as uuid} from 'uuid'
const debug = require('debug')('gb:models')

import checkGraduatability from '../helpers/check-student-graduatability'
import randomChar from '../helpers/random-char'
import getCourses from '../helpers/get-courses'

export async function getStudentData(student) {
	const courses = await student.courses

	return {
		courses: courses,
		creditsNeeded: student.creditsNeeded,
		fabrications: student.fabrications,
		graduation: student.graduation,
		matriculation: student.matriculation,
		overrides: student.overrides,
	}
}

const now = new Date()

export default function Student(data) {
	const startTime = present()

	const baseStudent = {
		id: uuid(),
		name: 'Student ' + randomChar(),
		version: VERSION,

		creditsNeeded: 35,

		matriculation: now.getFullYear() - 2,
		graduation: now.getFullYear() + 2,
		advisor: '',

		dateLastModified: new Date(),
		dateCreated: new Date(),

		studies: [],
		schedules: {},
		overrides: {},
		fabrications: {},

		settings: {},

		graduatability: Promise.resolve({
			canGraduate: false,
			studyResults: [],
		}),

		get courses() {
			// - At it's core, this method just needs to get the list of courses that a student has chosen.
			// - Each schedule has a list of courses that are a part of that schedule.
			// - Additionally, we only care about the schedules that are marked as "active".
			// - Keep in mind that each list of courses is actually a *promise* for the courses.
			// - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
			// - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
			//   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.

			const start = present()

			const activeSchedules = filter(this.schedules, {active: true})
			const promisesForCourses = pluck(activeSchedules, 'courses')

			return Promise.all(promisesForCourses)
				.then(courses => {
					debug(`Student(${this.id}).courses: it took ${round(present() - start, 2)} ms to fetch`)
					return uniq(flatten(courses), course => course.clbid)
				})
				.catch(err => console.error(err))
		},

		toJSON() {
			return omit(this, value => value instanceof Promise)
		},
	}

	const student = {
		...baseStudent,
		...data,
	}

	student.graduatability = checkGraduatability(student)

	debug(`Student(): it took ${round(present() - startTime, 2)} ms to make a student`)

	return student
}


export function addScheduleToStudent(student, newSchedule) {
	return {...student, schedules: {...student.schedules, [newSchedule.id]: newSchedule}}
}

export function destroyScheduleFromStudent(student, scheduleId) {
	debug(`Student.destroySchedule(): removing schedule ${scheduleId}`)

	const deadSched = student.schedules[scheduleId]
	const schedules = omit(student.schedules, [scheduleId])

	if (deadSched && deadSched.active) {
		const otherSchedKey = findKey(schedules, sched =>
			sched.year === deadSched.year &&
			sched.semester === deadSched.semester &&
			sched.id !== deadSched.id)

		if (otherSchedKey) {
			schedules[otherSchedKey] = {...schedules[otherSchedKey], active: true}
		}
	}

	return {...student, schedules}
}


export function addCourseToSchedule(schedule, clbid) {
	let start = present()
	debug(`adding clbid ${clbid} to schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	if (!isNumber(clbid)) {
		throw new TypeError('addCourse(): clbid must be a number')
	}

	if (contains(schedule.clbids, clbid)) {
		return schedule
	}

	let sched = {...schedule}

	sched.clbids.push(clbid)
	sched.courses = getCourses(sched.clbids, {year: sched.year, semester: sched.semester})
	sched.courses.then(d => debug(`it took ${Math.round(present() - start)}ms to add ${clbid} to ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids, 'titles:', d.map(c => c.title)))

	return sched
}

export function removeCourseFromSchedule(student, scheduleId, clbid) {
	if (!isNumber(clbid)) {
		throw new TypeError('removeCourse(): clbid must be a number')
	}

	let start = present()

	let sched = {...find(student.schedules, {id: scheduleId})}
	let schedules = omit(student.schedules, [scheduleId])

	debug(`removing clbid ${clbid} from schedule ${sched.id} (${sched.year}-${sched.semester}.${sched.index})`)

	sched.clbids = reject(sched.clbids, id => id === clbid)
	sched.courses = getCourses(sched.clbids)
	sched.courses.then(d => debug(`it took ${Math.round(present() - start)}ms to remove ${clbid} from ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids, 'titles:', d.map(c => c.title)))

	return {...student, schedules}
}

export function moveCourseToSchedule(student, fromScheduleId, toScheduleId, clbid) {
	debug(`Student.moveCourse(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)

	let schedules = {...student.schedules}
	schedules[fromScheduleId] = removeCourseToSchedule(schedules[fromScheduleId], clbid)
	schedules[toScheduleId] = addCourseToSchedule(schedules[toScheduleId], clbid)

	return {...student, schedules}
}


export function addAreaToStudent(student, areaOfStudy) {
	return {...student, studies: [...student.studies, areaOfStudy]}
}

export function removeAreaToSchedule(student, areaPath) {
	return {...student, studies: reject([...student.studies], {path: areaPath})}
}


export function setOverride(student, key, value) {
	let overrides = {...student.overrides}
	overrides[key] = value
	return {...student, overrides}
}

export function removeOverride(student, key) {
	let overrides = {...student.overrides}
	delete overrides[key]
	return {...student, overrides}
}


export function addFabrication(student, fabrication) {
	let fabrications = {...student.fabrications, [fabrication.id]: fabrication}
	return {...student, fabrications}
}

export function removeFabrication(student, fabricationId) {
	let fabrications = {...student.fabrications}
	delete fabrications[fabricationId]
	return {...student, fabrications}
}


export function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}

export function saveStudent(student) {
	// grab the old (still JSON-encoded) student from localstorage
	// compare it to the current one
	// if they're different, update dateLastModified, stringify, and save.
	const oldVersion = localStorage.getItem(student.id)

	if (oldVersion !== stringify(student)) {
		debug(`saving student ${student.name} (${student.id})`)
		const student = student.dateLastModified = new Date()
		localStorage.setItem(student.id, stringify(student))
	}
}



export function moveSchedule(schedule, {year, semester}={}) {
	if (year === undefined && semester === undefined) {
		return schedule
	}

	let sched = {...schedule}
	if (typeof year === 'number') {
		sched.year = year
	}
	if (typeof semester === 'number') {
		sched.semester = semester
	}

	return sched
}

export function reorderSchedule(schedule, index) {
	return {...schedule, index}
}

export function renameSchedule(schedule, title) {
	return {...schedule, title}
}

export function reorderCourse(schedule, clbid, newIndex) {
	if (!isNumber(clbid)) {
		throw new TypeError('reorderCourse(): clbid must be a number')
	}

	let sched = {...schedule}

	const oldIndex = findIndex(sched.clbids, id => id === clbid)

	sched.clbids.splice(oldIndex, 1)
	sched.clbids.splice(newIndex, 0, clbid)

	sched.courses = getCourses(sched.clbids, {year: sched.year, semester: sched.semester})

	return sched
}


export function validateSchedule(schedule) {
	// Checks to see if the schedule is valid
	return schedule.courses.then(courses => {
		// only check the courses that have data
		courses = reject(courses, isUndefined)

		// Step one: do any times conflict?
		const conflicts = findWarnings(courses, schedule)

		const flattened = flatten(conflicts)
		const filtered = filter(flattened, identity)
		const warnings = pluck(filtered, 'warning')
		const hasConflict = some(warnings, isTrue)

		if (hasConflict) {
			debug('schedule conflicts', conflicts, hasConflict)
		}

		return {hasConflict, conflicts}
	})
}

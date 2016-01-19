import clone from 'lodash/lang/clone'
import contains from 'lodash/collection/contains'
import findIndex from 'lodash/array/findIndex'
import findKey from 'lodash/object/findKey'
import isArray from 'lodash/lang/isArray'
import isNumber from 'lodash/lang/isNumber'
import isUndefined from 'lodash/lang/isUndefined'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import omit from 'lodash/object/omit'
import reject from 'lodash/collection/reject'
import zipObject from 'lodash/array/zipObject'
import {v4 as uuid} from 'uuid'

import randomChar from '../helpers/random-char'

const now = new Date()
import Schedule from './schedule'

export default function Student(data) {
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
	}

	const student = {
		...baseStudent,
		...data,
	}

	if (isArray(student.schedules)) {
		student.schedules = zipObject(map(student.schedules, s => [String(s.id), {...s, id: String(s.id)}]))
	}

	student.schedules = mapValues(student.schedules, Schedule)

	return student
}


////////
////////
////////

export function changeStudentName(student, newName) {
	return {...student, name: newName}
}
export function changeStudentAdvisor(student, newAdvisor) {
	return {...student, advisor: newAdvisor}
}
export function changeStudentCreditsNeeded(student, newCreditsNeeded) {
	return {...student, creditsNeeded: newCreditsNeeded}
}
export function changeStudentMatriculation(student, newMatriculation) {
	return {...student, matriculation: newMatriculation}
}
export function changeStudentGraduation(student, newGraduation) {
	return {...student, graduation: newGraduation}
}
export function changeStudentSetting(student, key, value) {
	return {...student, settings: {...student.settings, [key]: value}}
}


export function addScheduleToStudent(student, newSchedule) {
	if (student.schedules instanceof Array) {
		throw new TypeError('addScheduleToStudent: schedules must not be an array!')
	}

	return {...student, schedules: {...student.schedules, [newSchedule.id]: newSchedule}}
}

export function destroyScheduleFromStudent(student, scheduleId) {
	debug(`Student.destroySchedule(): removing schedule ${scheduleId}`)

	if (student.schedules instanceof Array) {
		throw new TypeError('destroyScheduleFromStudent: schedules must not be an array!')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`Could not find a schedule with an ID of ${scheduleId}.`)
	}

	const deadSched = student.schedules[scheduleId]
	const schedules = omit(student.schedules, [scheduleId])

	if (deadSched && deadSched.active) {
		const otherSchedKey = findKey(schedules, sched =>
			sched.year === deadSched.year &&
			sched.semester === deadSched.semester &&
			sched.id !== deadSched.id)

		/* istanbul ignore else */
		if (otherSchedKey) {
			schedules[otherSchedKey] = {...schedules[otherSchedKey], active: true}
		}
	}

	return {...student, schedules}
}


export function addCourseToSchedule(student, scheduleId, clbid) {
	if (!isNumber(clbid)) {
		throw new TypeError('addCourse(): clbid must be a number')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`Could not find a schedule with an ID of ${scheduleId}.`)
	}

	let schedule = clone(student.schedules[scheduleId])

	// If the schedule already has the course we're adding, just return the student
	if (contains(schedule.clbids, clbid)) {
		return student
	}

	debug(`adding clbid ${clbid} to schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	schedule.clbids = schedule.clbids.concat(clbid)

	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

export function removeCourseFromSchedule(student, scheduleId, clbid) {
	if (!isNumber(clbid)) {
		throw new TypeError(`removeCourse(): clbid must be a number (was ${typeof clbid})`)
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`Could not find a schedule with an ID of ${scheduleId}.`)
	}

	let schedule = clone(student.schedules[scheduleId])

	// If the schedule doesn't have the course we're removing, just return the student
	if (!contains(schedule.clbids, clbid)) {
		return student
	}

	debug(`removing clbid ${clbid} from schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	schedule.clbids = reject(schedule.clbids, id => id === clbid)

	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

export function moveCourseToSchedule(student, {fromScheduleId, toScheduleId, clbid}) {
	debug(`moveCourseToSchedule(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)

	student = removeCourseFromSchedule(student, fromScheduleId, clbid)
	student = addCourseToSchedule(student, toScheduleId, clbid)

	return {...student}
}


export function addAreaToStudent(student, areaOfStudy) {
	return {...student, studies: [...student.studies, areaOfStudy]}
}

export function removeAreaFromStudent(student, areaQuery) {
	return {...student, studies: reject(student.studies, areaQuery)}
}


export function setOverrideOnStudent(student, key, value) {
	let overrides = {...student.overrides}
	overrides[key] = value
	return {...student, overrides}
}

export function removeOverrideFromStudent(student, key) {
	let overrides = omit(student.overrides, [key])
	return {...student, overrides}
}


export function addFabricationToStudent(student, fabrication) {
	if (!('clbid' in fabrication)) {
		throw new ReferenceError(`addFabricationToStudent: fabrications must include a clbid`)
	}
	if (typeof fabrication.clbid !== 'string') {
		throw new TypeError(`addFabricationToStudent: clbid must be a string`)
	}
	let fabrications = {...student.fabrications, [fabrication.clbid]: fabrication}
	return {...student, fabrications}
}

export function removeFabricationFromStudent(student, fabricationId) {
	if (typeof fabricationId !== 'string') {
		throw new TypeError(`removeCourseFromSchedule: clbid must be a string`)
	}
	let fabrications = omit(student.fabrications, [fabricationId])
	return {...student, fabrications}
}


export function moveScheduleInStudent(student, scheduleId, {year, semester}={}) {
	if (year === undefined && semester === undefined) {
		throw new RangeError('moveScheduleInStudent: Either year or semester must be provided.')
	}
	if (!isUndefined(year) && !isNumber(year)) {
		throw new TypeError('moveScheduleInStudent: year must be a number.')
	}
	if (!isUndefined(semester) && !isNumber(semester)) {
		throw new TypeError('moveScheduleInStudent: semester must be a number.')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`moveScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`)
	}

	let schedule = clone(student.schedules[scheduleId])

	if (isNumber(year)) {
		schedule.year = year
	}
	if (isNumber(semester)) {
		schedule.semester = semester
	}

	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

export function reorderScheduleInStudent(student, scheduleId, index) {
	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`reorderScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`)
	}

	let schedule = {...student.schedules[scheduleId], index: index}
	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

export function renameScheduleInStudent(student, scheduleId, title) {
	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`renameScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`)
	}

	let schedule = {...student.schedules[scheduleId], title: title}
	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

export function reorderCourseInSchedule(student, scheduleId, {clbid, index}) {
	if (!isNumber(clbid)) {
		throw new TypeError('reorderCourse(): clbid must be a number')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(`reorderCourseInSchedule: Could not find a schedule with an ID of "${scheduleId}".`)
	}

	let schedule = clone(student.schedules[scheduleId])

	if (index < 0) {
		index = 0
	}
	else if (index >= schedule.clbids.length) {
		index = schedule.clbids.length - 1
	}

	const oldIndex = findIndex(schedule.clbids, id => id === clbid)

	if (oldIndex === -1) {
		throw new ReferenceError(`reorderCourseInSchedule: ${clbid} is not in schedule "${scheduleId}"`)
	}

	schedule.clbids = [...schedule.clbids]
	schedule.clbids.splice(oldIndex, 1)
	schedule.clbids.splice(index, 0, clbid)

	return {...student, schedules: {...student.schedules, [schedule.id]: schedule}}
}

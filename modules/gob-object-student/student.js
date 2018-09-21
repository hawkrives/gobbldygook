// @flow

import clone from 'lodash/clone'
import findIndex from 'lodash/findIndex'
import findKey from 'lodash/findKey'
import fromPairs from 'lodash/fromPairs'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import reject from 'lodash/reject'
import uuid from 'uuid/v4'
import debug from 'debug'
const log = debug('student-format:student')

import {randomChar} from '@gob/lib'

import type {
	AreaOfStudyType,
	AreaQuery,
	OverrideType,
	FabricationType,
} from './types'

const now = new Date()
import {Schedule, type ScheduleType} from './schedule'

export type StudentType = {
	id: string,
	name: string,
	version: string,
	creditsNeeded: number,
	matriculation: number,
	graduation: number,
	advisor: string,
	dateLastModified: Date,
	dateCreated: Date,

	studies: Array<{}>,
	schedules: {[key: string]: ScheduleType},
	overrides: {},
	fabrications: {},
	fulfillments: {},

	settings: {},
}

type IncomingStudent = {}

export function Student(data: IncomingStudent): StudentType {
	const baseStudent = {
		id: uuid(),
		name: 'Student ' + randomChar(),
		version: global.VERSION,

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
		fulfillments: {},

		settings: {},
	}

	const student = {...baseStudent, ...data}

	if (Array.isArray(student.schedules)) {
		student.schedules = fromPairs(
			map(student.schedules, s => [
				String(s.id),
				{...s, id: String(s.id)},
			]),
		)
	}

	student.schedules = mapValues(student.schedules, Schedule)

	return student
}

////////
////////
////////

export function changeStudentName(student: StudentType, newName: string) {
	if (student.name === newName) {
		return student
	}
	return {...student, name: newName}
}

export function changeStudentAdvisor(student: StudentType, newAdvisor: string) {
	if (student.advisor === newAdvisor) {
		return student
	}
	return {...student, advisor: newAdvisor}
}

export function changeStudentCreditsNeeded(
	student: StudentType,
	newCreditsNeeded: number,
) {
	if (student.creditsNeeded === newCreditsNeeded) {
		return student
	}
	return {...student, creditsNeeded: newCreditsNeeded}
}

export function changeStudentMatriculation(
	student: StudentType,
	newMatriculation: number,
) {
	if (student.matriculation === newMatriculation) {
		return student
	}
	return {...student, matriculation: newMatriculation}
}

export function changeStudentGraduation(
	student: StudentType,
	newGraduation: number,
) {
	if (student.graduation === newGraduation) {
		return student
	}
	return {...student, graduation: newGraduation}
}

export function changeStudentSetting(
	student: StudentType,
	key: string,
	value: mixed,
) {
	if (student.settings && student.settings[key] === value) {
		return student
	}
	return {...student, settings: {...student.settings, [key]: value}}
}

export function addScheduleToStudent(
	student: StudentType,
	newSchedule: ScheduleType,
) {
	if (student.schedules instanceof Array) {
		throw new TypeError(
			'addScheduleToStudent: schedules must not be an array!',
		)
	}

	return {
		...student,
		schedules: {...student.schedules, [newSchedule.id]: newSchedule},
	}
}

export function destroyScheduleFromStudent(
	student: StudentType,
	scheduleId: string,
) {
	log(`Student.destroySchedule(): removing schedule ${scheduleId}`)

	if (student.schedules instanceof Array) {
		throw new TypeError(
			'destroyScheduleFromStudent: schedules must not be an array!',
		)
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`Could not find a schedule with an ID of ${scheduleId}.`,
		)
	}

	const deadSched = student.schedules[scheduleId]
	const schedules = omit(student.schedules, scheduleId)

	if (deadSched && deadSched.active) {
		const otherSchedKey = findKey(
			schedules,
			sched =>
				sched.year === deadSched.year &&
				sched.semester === deadSched.semester &&
				sched.id !== deadSched.id,
		)

		/* istanbul ignore else */
		if (otherSchedKey) {
			schedules[otherSchedKey] = {
				...schedules[otherSchedKey],
				active: true,
			}
		}
	}

	return {...student, schedules}
}

export function addCourseToSchedule(
	student: StudentType,
	scheduleId: string,
	clbid: string,
) {
	if (typeof clbid !== 'string') {
		throw new TypeError('addCourse(): clbid must be a string')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`Could not find a schedule with an ID of ${scheduleId}.`,
		)
	}

	let schedule = clone(student.schedules[scheduleId])

	// If the schedule already has the course we're adding, just return the student
	if (schedule.clbids.includes(clbid)) {
		return student
	}

	log(
		`adding clbid ${clbid} to schedule ${schedule.id} (${schedule.year}-${
			schedule.semester
		}.${schedule.index})`,
	)

	schedule.clbids = [...schedule.clbids, clbid]

	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

export function removeCourseFromSchedule(
	student: StudentType,
	scheduleId: string,
	clbid: string,
) {
	if (typeof clbid !== 'string') {
		throw new TypeError(
			`removeCourse(): clbid must be a string (was ${typeof clbid})`,
		)
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`Could not find a schedule with an ID of ${scheduleId}.`,
		)
	}

	let schedule = clone(student.schedules[scheduleId])

	// If the schedule doesn't have the course we're removing, just return the student
	if (!schedule.clbids.includes(clbid)) {
		return student
	}

	log(
		`removing clbid ${clbid} from schedule ${schedule.id} (${
			schedule.year
		}-${schedule.semester}.${schedule.index})`,
	)

	schedule.clbids = schedule.clbids.filter(id => id !== clbid)

	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

export function moveCourseToSchedule(
	student: StudentType,
	{
		fromScheduleId,
		toScheduleId,
		clbid,
	}: {fromScheduleId: string, toScheduleId: string, clbid: string},
) {
	log(
		`moveCourseToSchedule(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`,
	)

	student = removeCourseFromSchedule(student, fromScheduleId, clbid)
	student = addCourseToSchedule(student, toScheduleId, clbid)

	return {...student}
}

export function addAreaToStudent(
	student: StudentType,
	areaOfStudy: AreaOfStudyType,
) {
	return {...student, studies: [...student.studies, areaOfStudy]}
}

export function removeAreaFromStudent(
	student: StudentType,
	areaQuery: AreaQuery,
) {
	return {...student, studies: reject(student.studies, areaQuery)}
}

export function setOverrideOnStudent(
	student: StudentType,
	key: string,
	value: OverrideType,
) {
	return {...student, overrides: {...student.overrides, [key]: value}}
}

export function removeOverrideFromStudent(student: StudentType, key: string) {
	let overrides = omit(student.overrides, key)
	return {...student, overrides}
}

export function addFabricationToStudent(
	student: StudentType,
	fabrication: FabricationType,
) {
	if (!('clbid' in fabrication)) {
		throw new ReferenceError(
			'addFabricationToStudent: fabrications must include a clbid',
		)
	}
	if (typeof fabrication.clbid !== 'string') {
		throw new TypeError('addFabricationToStudent: clbid must be a string')
	}
	let fabrications = {
		...student.fabrications,
		[fabrication.clbid]: fabrication,
	}
	return {...student, fabrications}
}

export function removeFabricationFromStudent(
	student: StudentType,
	fabricationId: string,
) {
	if (typeof fabricationId !== 'string') {
		throw new TypeError('removeCourseFromSchedule: clbid must be a string')
	}
	let fabrications = omit(student.fabrications, fabricationId)
	return {...student, fabrications}
}

export function moveScheduleInStudent(
	student: StudentType,
	scheduleId: string,
	{year, semester}: {year?: number, semester?: number} = {},
): StudentType {
	if (year === undefined && semester === undefined) {
		throw new RangeError(
			'moveScheduleInStudent: Either year or semester must be provided.',
		)
	}
	if (year != null && typeof year !== 'number') {
		throw new TypeError('moveScheduleInStudent: year must be a number.')
	}
	if (semester != null && typeof semester !== 'number') {
		throw new TypeError('moveScheduleInStudent: semester must be a number.')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`moveScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
		)
	}

	let schedule = {...student.schedules[scheduleId]}

	if (year != null) {
		schedule.year = year
	}

	if (semester != null) {
		schedule.semester = semester
	}

	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

export function reorderScheduleInStudent(
	student: StudentType,
	scheduleId: string,
	index: number,
) {
	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`reorderScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
		)
	}

	let schedule = {...student.schedules[scheduleId], index}
	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

export function renameScheduleInStudent(
	student: StudentType,
	scheduleId: string,
	title: string,
) {
	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`renameScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
		)
	}

	let schedule = {...student.schedules[scheduleId], title}
	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

export function reorderCourseInSchedule(
	student: StudentType,
	scheduleId: string,
	{clbid, index}: {clbid: string, index: number},
) {
	if (typeof clbid !== 'string') {
		throw new TypeError('reorderCourse(): clbid must be a string')
	}

	if (!(scheduleId in student.schedules)) {
		throw new ReferenceError(
			`reorderCourseInSchedule: Could not find a schedule with an ID of "${scheduleId}".`,
		)
	}

	let schedule = clone(student.schedules[scheduleId])

	if (index < 0) {
		index = 0
	} else if (index >= schedule.clbids.length) {
		index = schedule.clbids.length - 1
	}

	const oldIndex = findIndex(schedule.clbids, id => id === clbid)

	if (oldIndex === -1) {
		throw new ReferenceError(
			`reorderCourseInSchedule: ${clbid} is not in schedule "${scheduleId}"`,
		)
	}

	schedule.clbids = [...schedule.clbids]
	schedule.clbids.splice(oldIndex, 1)
	schedule.clbids.splice(index, 0, clbid)

	return {
		...student,
		schedules: {...student.schedules, [schedule.id]: schedule},
	}
}

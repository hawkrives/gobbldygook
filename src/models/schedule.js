import reject from 'lodash/collection/reject'
import isUndefined from 'lodash/lang/isUndefined'
import isNumber from 'lodash/lang/isNumber'
import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import identity from 'lodash/utility/identity'
import pluck from 'lodash/collection/pluck'
import some from 'lodash/collection/some'
import findIndex from 'lodash/array/findIndex'
import contains from 'lodash/collection/contains'
import omit from 'lodash/object/omit'
import {v4 as uuid} from 'uuid'
import present from 'present'
const debug = require('debug')('gb:models')

import randomChar from '../helpers/random-char'
import isTrue from '../helpers/is-true'
import getCourses from '../helpers/get-courses'
import findWarnings from '../helpers/find-course-warnings'

export default function Schedule(data={}) {
	if (!(this instanceof Schedule)) {
		return new Schedule(data)
	}

	const baseSchedule = {
		id: uuid(),
		active: false,

		index: 1,
		title: `Schedule ${randomChar().toUpperCase()}`,

		clbids: [],
		year: 0,
		semester: 0,

		courses: Promise.resolve([]),

		toJSON() {
			return omit(this, value => value instanceof Promise)
		},
	}

	let schedule = {
		...baseSchedule,
		...data,
	}

	schedule.courses = getCourses(schedule.clbids, {year: schedule.year, semester: schedule.semester})

	return schedule
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

export function addCourse(schedule, clbid) {
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

export function removeCourse(schedule, clbid) {
	let start = present()
	debug(`removing clbid ${clbid} from schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	if (!isNumber(clbid)) {
		throw new TypeError('removeCourse(): clbid must be a number')
	}

	let sched = {...schedule}

	sched.clbids = reject(sched.clbids, id => id === clbid)
	sched.courses = getCourses(sched.clbids)
	sched.courses.then(d => debug(`it took ${Math.round(present() - start)}ms to remove ${clbid} from ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids, 'titles:', d.map(c => c.title)))

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

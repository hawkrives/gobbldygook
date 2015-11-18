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
import remove from 'lodash/array/remove'
import {v4 as uuid} from 'uuid'

import randomChar from '../helpers/random-char'
import isTrue from '../helpers/is-true'
import getCourses from '../lib/get-courses'
import findWarnings from '../lib/find-course-warnings'

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


export function moveSchedule(schedule, year, semester) {
	let sched = {...schedule}
	if (year) {
		sched.year = year
	}
	if (semester) {
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

	const oldIndex = findIndex(sched.clbids, clbid)
	const course = sched.clbids[oldIndex]

	sched.clbids.splice(oldIndex, 1)
	sched.clbids.splice(newIndex, 0, clbid)

	sched.courses.splice(oldIndex, 1)
	sched.courses.splice(newIndex, 0, course)

	return sched
}

export function addCourse(schedule, clbid) {
	// let start = present()
	// console.log(`adding clbid ${clbid} to schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	if (!isNumber(clbid)) {
		throw new TypeError('addCourse(): clbid must be a number')
	}

	if (contains(schedule.clbids, clbid)) {
		return schedule
	}

	let sched = {...schedule}

	sched.clbids.push(clbid)
	sched.courses = getCourses(sched.clbids, {year: sched.year, semester: sched.semester})
	// sched.courses.then(d => console.log(`it took ${Math.round(present() - start)}ms to add ${clbid} to ${sched.year}-${sched.semester};`, 'clbids:', sched.clbids.toJS(), 'titles:', d.map(c => c.title)))

	return sched
}

export function removeCourse(schedule, clbid) {
	// let start = present()
	// console.log(`removing clbid ${clbid} from schedule ${schedule.id} (${schedule.year}-${schedule.semester}.${schedule.index})`)

	if (!isNumber(clbid)) {
		throw new TypeError('removeCourse(): clbid must be a number')
	}

	let sched = {...schedule}

	const index = findIndex(sched.clbids, clbid)

	remove(sched.clbids, (_, i) => i === index)
	sched.courses = getCourses(sched.clbids)
	// schedule.courses.then(d => console.log(`it took ${Math.round(present() - start)}ms to remove ${clbid} from ${this.year}-${this.semester};`, 'clbids:', sched.clbids.toJS(), 'titles:', d.map(c => c.title)))

	return sched
}

export function validateSchedule(schedule) {
	// Checks to see if the schedule is valid
	return schedule.courses.then(courses => {
		// only check the courses that have data
		courses = reject(courses, isUndefined)

		// Step one: do any times conflict?
		const conflicts = findWarnings(courses, this.toJS())

		const flattened = flatten(conflicts)
		const filtered = filter(flattened, identity)
		const warnings = pluck(filtered, 'warning')
		const hasConflict = some(warnings, isTrue)

		// if (hasConflict) {
		// 	console.log('schedule conflicts', conflicts, hasConflict)
		// }

		return {hasConflict, conflicts}
	})
}

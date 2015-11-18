import flatten from 'lodash/array/flatten'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import omit from 'lodash/object/omit'
import uniq from 'lodash/array/uniq'
import round from 'lodash/math/round'
import findKey from 'lodash/object/findKey'
import remove from 'lodash/array/remove'
import {v4 as uuid} from 'uuid'
import stringify from 'json-stable-stringify'
import present from 'present'

import checkGraduatability from '../lib/check-student-graduatability'

import randomChar from '../helpers/random-char'

import {addCourse, removeCourse} from './schedule'

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
					console.log(`Student(${this.id}).courses: it took ${round(present() - start, 2)} ms to fetch`)
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

	console.log(`Student(): it took ${round(present() - startTime, 2)} ms to make a student`)

	return student
}


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


export function addSchedule(student, newSchedule) {
	return {...student, schedules: {...student.schedules, [newSchedule.id]: newSchedule}}
}
export function destroySchedule(student, scheduleId) {
	console.log(`Student.destroySchedule(): removing schedule ${scheduleId}`)

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
export function moveCourse(student, fromScheduleId, toScheduleId, clbid) {
	console.log(`Student.moveCourse(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`)

	let schedules = {...student.schedules}
	schedules[fromScheduleId] = removeCourse(schedules[fromScheduleId], clbid)
	schedules[toScheduleId] = addCourse(schedules[toScheduleId], clbid)

	return {...student, schedules}
}


export function addArea(student, areaOfStudy) {
	return {...student, studies: [...student.studies, areaOfStudy]}
}
export function removeArea(student, areaPath) {
	let studies = [...student.studies]
	remove(studies, {path: areaPath})
	return {...student, studies}
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



// helpers

export function encodeStudent(student) {
	return encodeURIComponent(stringify(student))
}

export function saveStudent(student) {
	// grab the old (still JSON-encoded) student from localstorage
	// compare it to the current one
	// if they're different, update dateLastModified, stringify, and save.
	const oldVersion = localStorage.getItem(student.id)

	if (oldVersion !== stringify(student)) {
		console.log(`saving student ${student.name} (${student.id})`)

		const student = student.set('dateLastModified', new Date())
		localStorage.setItem(student.id, stringify(student))
	}
}

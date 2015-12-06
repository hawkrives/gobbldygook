import reject from 'lodash/collection/reject'
import forEach from 'lodash/collection/forEach'
import range from 'lodash/utility/range'
import map from 'lodash/collection/map'
import uniq from 'lodash/array/uniq'
import last from 'lodash/array/last'

import Student, {addScheduleToStudent} from '../../models/student'
import Schedule from '../../models/schedule'
import Study from '../../models/study'
import {removeStudentFromCache} from '../../models/save-student'

import {
	LOAD_STUDENTS,
	INIT_STUDENT,
	IMPORT_STUDENT,
	DESTROY_STUDENT,
	CHANGE_NAME,
	CHANGE_ADVISOR,
	CHANGE_CREDITS_NEEDED,
	CHANGE_MATRICULATION,
	CHANGE_GRADUATION,
	CHANGE_SETTING,
	ADD_AREA,
	REMOVE_AREA,
	REMOVE_AREAS,
	ADD_SCHEDULE,
	DESTROY_SCHEDULE,
	DESTROY_SCHEDULES,
	RENAME_SCHEDULE,
	REORDER_SCHEDULE,
	MOVE_SCHEDULE,
	ADD_COURSE,
	REMOVE_COURSE,
	REORDER_COURSE,
	MOVE_COURSE,
	SET_OVERRIDE,
	REMOVE_OVERRIDE,
	ADD_FABRICATION,
	REMOVE_FABRICATION,
} from '../constants/students'


export async function loadStudents() {
	// Get the list of students we know about, or the string 'null',
	// if localStorage doesn't have the key 'studentIds'.
	let studentIds = uniq(JSON.parse(localStorage.getItem('studentIds')) || [])

	// pull the students from localStorage
	const studentIdPairs = map(studentIds, id => [id, localStorage.getItem(id)])

	// Remove any broken students from localStorage
	forEach(studentIdPairs, ([id, rawStudent]) => {
		if (rawStudent === '[object Object]') {
			localStorage.removeItem(id)
		}
		return rawStudent
	})

	// take the array of [id,student] pairs and just grab the students
	const rawStudents = map(studentIdPairs, last)

	// filter out any that don't exist and/or are just plain bad
	const validStudents = reject(rawStudents, rawStudent => (
		rawStudent === null || rawStudent === '[object Object]'))

	const students = map(validStudents, rawStudent => {
		// basicStudent defaults to an empty object so that the constructor
		// has something to build from.
		let basicStudent = {}

		try {
			basicStudent = JSON.parse(rawStudent)
		}
		catch (e) {
			console.error(e)
		}

		let student = Student(basicStudent)

		return student
	})

	return { type: LOAD_STUDENTS, payload: students }
}


export function initStudent() {
	let student = new Student()

	forEach(range(student.matriculation, student.graduation), year => {
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 1}))
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 2}))
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 3}))
	})

	return { type: INIT_STUDENT, payload: student }
}

export function importStudent({data, type}={}) {
	let stu = undefined
	if (type === 'application/json') {
		try {
			stu = JSON.parse(data)
		}
		catch (err) {
			return { type: IMPORT_STUDENT, error: true, payload: err }
		}
	}
	else {
		return {
			type: IMPORT_STUDENT,
			error: true,
			payload: new TypeError(`importStudent: ${type} is an invalid data type`),
		}
	}

	if (!stu) {
		return {
			type: IMPORT_STUDENT,
			error: true,
			payload: new Error('Could not process data: ' + data),
		}
	}

	const fleshedStudent = new Student(stu)
	return { type: IMPORT_STUDENT, payload: fleshedStudent }
}

export async function destroyStudent(studentId) {
	removeStudentFromCache(studentId)
	localStorage.removeItem(studentId)

	return { type: DESTROY_STUDENT, payload: {studentId} }
}


export function changeName(studentId, name) {
	return { type: CHANGE_NAME, payload: {studentId, name} }
}
export function changeAdvisor(studentId, advisor) {
	return { type: CHANGE_ADVISOR, payload: {studentId, advisor} }
}
export function changeCreditsNeeded(studentId, credits) {
	return { type: CHANGE_CREDITS_NEEDED, payload: {studentId, credits} }
}
export function changeMatriculation(studentId, matriculation) {
	return { type: CHANGE_MATRICULATION, payload: {studentId, matriculation} }
}
export function changeGraduation(studentId, graduation) {
	return { type: CHANGE_GRADUATION, payload: {studentId, graduation} }
}
export function changeSetting(studentId, key, value) {
	return { type: CHANGE_SETTING, payload: {studentId, key, value} }
}


export function addArea(studentId, areaQuery) {
	let area = new Study(areaQuery)
	return { type: ADD_AREA, payload: {studentId, area} }
}
export function removeArea(studentId, areaQuery) {
	return { type: REMOVE_AREA, payload: {studentId, areaQuery} }
}
export function removeAreas(studentId, ...areaQueries) {
	return { type: REMOVE_AREAS, payload: {studentId, areaQueries} }
}


export function addSchedule(studentId, schedule) {
	const sched = new Schedule(schedule)
	return { type: ADD_SCHEDULE, payload: {studentId, schedule: sched} }
}
export function destroySchedule(studentId, scheduleId) {
	return { type: DESTROY_SCHEDULE, payload: {studentId, scheduleId} }
}
export function destroySchedules(studentId, ...scheduleIds) {
	return { type: DESTROY_SCHEDULES, payload: {studentId, scheduleIds} }
}
export function renameSchedule(studentId, scheduleId, newTitle) {
	return { type: RENAME_SCHEDULE, payload: {studentId, scheduleId, newTitle} }
}
export function reorderSchedule(studentId, scheduleId, newIndex) {
	return { type: REORDER_SCHEDULE, payload: {studentId, scheduleId, newIndex} }
}
export function moveSchedule(studentId, scheduleId, year, semester) {
	return { type: MOVE_SCHEDULE, payload: {studentId, scheduleId, year, semester} }
}


export function addCourse(studentId, scheduleId, clbid) {
	return { type: ADD_COURSE, payload: {studentId, scheduleId, clbid} }
}
export function removeCourse(studentId, scheduleId, clbid) {
	return { type: REMOVE_COURSE, payload: {studentId, scheduleId, clbid} }
}
export function reorderCourse(studentId, scheduleId, clbid, index) {
	return { type: REORDER_COURSE, payload: {studentId, scheduleId, clbid, index} }
}
export function moveCourse(studentId, fromScheduleId, toScheduleId, clbid) {
	return { type: MOVE_COURSE, payload: {studentId, fromScheduleId, toScheduleId, clbid} }
}


export function setOverride(studentId, key, value) {
	return { type: SET_OVERRIDE, payload: {studentId, key, value} }
}
export function removeOverride(studentId, overridePath) {
	return { type: REMOVE_OVERRIDE, payload: {studentId, override: overridePath} }
}


export function addFabrication(studentId, fabrication) {
	return { type: ADD_FABRICATION, payload: {studentId, fabrication} }
}
export function removeFabrication(studentId, fabricationId) {
	return { type: REMOVE_FABRICATION, payload: {studentId, fabricationId} }
}

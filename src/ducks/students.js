import undoable from 'redux-undo'

import remove from 'lodash/array/remove'
import forEach from 'lodash/collection/forEach'
import get from 'lodash/object/get'
import set from 'lodash/object/set'
import range from 'lodash/utility/range'

import Student, {
	saveStudent,
	addArea as addAreaToStudent,
	removeArea as removeAreaFromStudent,
	addSchedule as addScheduleToStudent,
	destroySchedule as destroyScheduleFromStudent,
	moveCourse as moveCourseAcrossSchedules,
	setOverride as setOverrideOnStudent,
	removeOverride as removeOverrideFromStudent,
	addFabrication as addFabricationToStudent,
	removeFabrication as removeFabricationFromStudent,
} from '../models/student'

import Schedule, {
	renameSchedule as renameScheduleInStudent,
	reorderSchedule as reorderScheduleInStudent,
	moveSchedule as moveScheduleInStudent,
	addCourse as addCourseToSchedule,
	removeCourse as removeCourseFromSchedule,
	reorderCourse as reorderCourseInSchedule,
} from '../models/schedule'

import Study from '../models/study'

export const INIT_STUDENT = 'INIT_STUDENT'
export const IMPORT_STUDENT = 'IMPORT_STUDENT'
export const DESTROY_STUDENT = 'DESTROY_STUDENT'

export const CHANGE_NAME = 'CHANGE_NAME'
export const CHANGE_ADVISOR = 'CHANGE_ADVISOR'
export const CHANGE_CREDITS_NEEDED = 'CHANGE_CREDITS_NEEDED'
export const CHANGE_MATRICULATION = 'CHANGE_MATRICULATION'
export const CHANGE_GRADUATION = 'CHANGE_GRADUATION'
export const CHANGE_SETTING = 'CHANGE_SETTING'

export const ADD_AREA = 'ADD_AREA'
export const REMOVE_AREA = 'REMOVE_AREA'
export const REMOVE_MULTIPLE_AREAS = 'REMOVE_MULTIPLE_AREAS'

export const ADD_SCHEDULE = 'ADD_SCHEDULE'
export const DESTROY_SCHEDULE = 'DESTROY_SCHEDULE'
export const DESTROY_MULTIPLE_SCHEDULES = 'DESTROY_MULTIPLE_SCHEDULES'
export const RENAME_SCHEDULE = 'RENAME_SCHEDULE'
export const REORDER_SCHEDULE = 'REORDER_SCHEDULE'
export const MOVE_SCHEDULE = 'MOVE_SCHEDULE'

export const ADD_COURSE = 'ADD_COURSE'
export const REMOVE_COURSE = 'REMOVE_COURSE'
export const REORDER_COURSE = 'REORDER_COURSE'
export const MOVE_COURSE = 'MOVE_COURSE'

export const SET_OVERRIDE = 'SET_OVERRIDE'
export const REMOVE_OVERRIDE = 'REMOVE_OVERRIDE'

export const ADD_FABRICATION = 'ADD_FABRICATION'
export const REMOVE_FABRICATION = 'REMOVE_FABRICATION'


const initialState = {}

function changeStudent(state, studentId, key, value) {
	const student = {...state[studentId]}
	student[key] = value
	return {...state, [studentId]: student}
}

function mutateStudent(state, studentId, path, pureFunc, ...args) {
	let student = {...state[studentId]}
	let item = get(student, path)
	item = pureFunc(item, ...args)
	set(student, path, item)
	return {...state, [studentId]: student}
}

function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case INIT_STUDENT:
		case IMPORT_STUDENT: {
			if (payload.error) {
				return state
			}
			return [...state, payload]
		}

		case DESTROY_STUDENT: {
			let newState = {...state}
			delete newState[payload.studentId]
			return newState
		}

		case CHANGE_NAME: {
			return changeStudent(state, payload.studentId, 'name', payload.name)
		}
		case CHANGE_ADVISOR: {
			return changeStudent(state, payload.studentId, 'advisor', payload.advisor)
		}
		case CHANGE_CREDITS_NEEDED: {
			return changeStudent(state, payload.studentId, 'creditsNeeded', payload.credits)
		}
		case CHANGE_MATRICULATION: {
			return changeStudent(state, payload.studentId, 'matriculation', payload.matriculation)
		}
		case CHANGE_GRADUATION: {
			return changeStudent(state, payload.studentId, 'graduation', payload.graduation)
		}
		case CHANGE_SETTING: {
			return changeStudent(state, payload.studentId, payload.key, payload.value)
		}

		case ADD_AREA: {
			const student = addAreaToStudent(state[payload.studentId], payload.area)
			return {...state, [payload.studentId]: student}
		}
		case REMOVE_AREA: {
			const student = removeAreaFromStudent(state[payload.studentId], payload.areaId)
			return {...state, [payload.studentId]: student}
		}
		case REMOVE_MULTIPLE_AREAS: {
			let student = {...state[payload.studentId]}
			for (const areaId of payload.areaIds) {
				student = removeAreaFromStudent(student, areaId)
			}
			return {...state, [payload.studentId]: student}
		}

		case ADD_SCHEDULE: {
			const student = addScheduleToStudent(state[payload.studentId], payload.schedule)
			return {...state, [payload.studentId]: student}
		}
		case DESTROY_SCHEDULE: {
			const student = destroyScheduleFromStudent(state[payload.studentId], payload.scheduleId)
			return {...state, [payload.studentId]: student}
		}
		case DESTROY_MULTIPLE_SCHEDULES: {
			let student = {...state[payload.studentId]}
			for (const id of payload.scheduleIds) {
				student = removeAreaFromStudent(student, id)
			}
			return {...state, [payload.studentId]: student}
		}
		case RENAME_SCHEDULE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], renameScheduleInStudent, payload.newTitle)
		}
		case REORDER_SCHEDULE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], reorderScheduleInStudent, payload.newIndex)
		}
		case MOVE_SCHEDULE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], moveScheduleInStudent, {year: payload.year, semester: payload.semester})
		}

		case ADD_COURSE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], addCourseToSchedule, payload.clbid)
		}
		case REMOVE_COURSE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], removeCourseFromSchedule, payload.clbid)
		}
		case REORDER_COURSE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], reorderCourseInSchedule, payload.clbid, payload.year, payload.semester)
		}
		case MOVE_COURSE: {
			return mutateStudent(state, payload.studentId, ['schedules', payload.scheduleId], moveCourseAcrossSchedules, payload.fromScheduleId, payload.toScheduleId, payload.clbid)
		}

		case SET_OVERRIDE: {
			const student = setOverrideOnStudent(state[payload.studentId], payload.key, payload.value)
			return {...state, [payload.studentId]: student}
		}
		case REMOVE_OVERRIDE: {
			const student = removeOverrideFromStudent(state[payload.studentId], payload.override)
			return {...state, [payload.studentId]: student}
		}
		case ADD_FABRICATION: {
			const student = addFabricationToStudent(state[payload.studentId], payload.fabrication)
			return {...state, [payload.studentId]: student}
		}
		case REMOVE_FABRICATION: {
			const student = removeFabricationFromStudent(state[payload.studentId], payload.fabricationId)
			return {...state, [payload.studentId]: student}
		}

		default: {
			return state
		}
	}
}

export default undoable(reducer, {
	limit: 10,

	initialState: initialState,
})



export function initStudent() {
	let student = new Student()

	forEach(range(student.matriculation, student.graduation), year => {
		student = addSchedule(student, {year, index: 1, active: true, semester: 1})
		student = addSchedule(student, {year, index: 1, active: true, semester: 2})
		student = addSchedule(student, {year, index: 1, active: true, semester: 3})
	})

	saveStudent(student)

	return { type: INIT_STUDENT, payload: student }
}

export function importStudent({data, type}) {
	let stu = undefined
	if (type === 'application/json') {
		try {
			stu = JSON.parse(data)
		}
		catch (err) {
			console.error(err)
			return { type: IMPORT_STUDENT, error: true, payload: err }
		}
	}

	if (stu) {
		const fleshedStudent = new Student(stu)
		saveStudent(fleshedStudent)
		return { type: IMPORT_STUDENT, payload: fleshedStudent }
	}

	return { type: IMPORT_STUDENT, error: true, payload: new Error('Could not process data: ' + data) }
}

export function destroyStudent(studentId) {
	let ids = JSON.parse(localStorage.getItem('studentIds'))
	remove(ids, id => id === studentId)
	localStorage.setItem('studentIds', JSON.stringify(ids))

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
export function removeArea(studentId, areaId) {
	return { type: REMOVE_AREA, payload: {studentId, areaId} }
}
export function removeMultipleAreas(studentId, ...areaIds) {
	return { type: REMOVE_MULTIPLE_AREAS, payload: {studentId, areaIds} }
}


export function addSchedule(studentId, schedule) {
	const sched = new Schedule(schedule)
	return { type: ADD_SCHEDULE, payload: {studentId, schedule: sched} }
}
export function destroySchedule(studentId, scheduleId) {
	return { type: DESTROY_SCHEDULE, payload: {studentId, scheduleId} }
}
export function destroyMultipleSchedules(studentId, ...scheduleIds) {
	return { type: DESTROY_MULTIPLE_SCHEDULES, payload: {studentId, scheduleIds} }
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

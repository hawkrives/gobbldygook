import undoable from 'redux-undo'
import get from 'lodash/object/get'
import set from 'lodash/object/set'

import {
	addArea as addAreaToStudent,
	removeArea as removeAreaFromStudent,
	addSchedule as addScheduleToStudent,
	destroySchedule as destroyScheduleFromStudent,
	moveCourse as moveCourseAcrossSchedules,
	setOverride as setOverrideOnStudent,
	removeOverride as removeOverrideFromStudent,
	addFabrication as addFabricationToStudent,
	removeFabrication as removeFabricationFromStudent,
	renameSchedule as renameScheduleInStudent,
	reorderSchedule as reorderScheduleInStudent,
	moveSchedule as moveScheduleInStudent,
	addCourse as addCourseToSchedule,
	removeCourse as removeCourseFromSchedule,
	reorderCourse as reorderCourseInSchedule,
} from '../models/student'

import {
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
	REMOVE_MULTIPLE_AREAS,
	ADD_SCHEDULE,
	DESTROY_SCHEDULE,
	DESTROY_MULTIPLE_SCHEDULES,
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

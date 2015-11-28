import undoable from 'redux-undo'
import omit from 'lodash/object/omit'

import {
	changeStudentName,
	changeStudentAdvisor,
	changeStudentCreditsNeeded,
	changeStudentMatriculation,
	changeStudentGraduation,
	changeStudentSetting,
	addAreaToStudent,
	removeAreaFromStudent,
	addScheduleToStudent,
	destroyScheduleFromStudent,
	moveCourseToSchedule,
	setOverrideOnStudent,
	removeOverrideFromStudent,
	addFabricationToStudent,
	removeFabricationFromStudent,
	renameScheduleInStudent,
	reorderScheduleInStudent,
	moveScheduleInStudent,
	addCourseToSchedule,
	removeCourseFromSchedule,
	reorderCourseInSchedule,
} from '../../models/student'

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


const initialState = {}

export function reducer(state = initialState, action) {
	const {type, payload, error} = action

	switch (type) {
		case INIT_STUDENT:
		case IMPORT_STUDENT: {
			if (error) {
				return state
			}
			return {...state, [payload.id]: payload}
		}

		case DESTROY_STUDENT: {
			return omit(state, [payload.studentId])
		}

		case CHANGE_NAME: {
			const student = changeStudentName(state[payload.studentId], payload.name)
			return {...state, [student.id]: student}
		}
		case CHANGE_ADVISOR: {
			const student = changeStudentAdvisor(state[payload.studentId], payload.advisor)
			return {...state, [student.id]: student}
		}
		case CHANGE_CREDITS_NEEDED: {
			const student = changeStudentCreditsNeeded(state[payload.studentId], payload.credits)
			return {...state, [student.id]: student}
		}
		case CHANGE_MATRICULATION: {
			const student = changeStudentMatriculation(state[payload.studentId], payload.matriculation)
			return {...state, [student.id]: student}
		}
		case CHANGE_GRADUATION: {
			const student = changeStudentGraduation(state[payload.studentId], payload.graduation)
			return {...state, [student.id]: student}
		}
		case CHANGE_SETTING: {
			const student = changeStudentSetting(state[payload.studentId], payload.key, payload.value)
			return {...state, [student.id]: student}
		}

		case ADD_AREA: {
			const student = addAreaToStudent(state[payload.studentId], payload.area)
			return {...state, [student.id]: student}
		}
		case REMOVE_AREA: {
			const student = removeAreaFromStudent(state[payload.studentId], payload.areaQuery)
			return {...state, [student.id]: student}
		}
		case REMOVE_AREAS: {
			let student = {...state[payload.studentId]}
			for (const areaQuery of payload.areaQueries) {
				student = removeAreaFromStudent(student, areaQuery)
			}
			return {...state, [student.id]: student}
		}

		case ADD_SCHEDULE: {
			const student = addScheduleToStudent(state[payload.studentId], payload.schedule)
			return {...state, [student.id]: student}
		}
		case DESTROY_SCHEDULE: {
			const student = destroyScheduleFromStudent(state[payload.studentId], payload.scheduleId)
			return {...state, [student.id]: student}
		}
		case DESTROY_SCHEDULES: {
			let student = state[payload.studentId]
			for (const id of payload.scheduleIds) {
				student = destroyScheduleFromStudent(student, id)
			}
			return {...state, [student.id]: student}
		}
		case RENAME_SCHEDULE: {
			const student = renameScheduleInStudent(state[payload.studentId], payload.scheduleId, payload.newTitle)
			return {...state, [student.id]: student}
		}
		case REORDER_SCHEDULE: {
			const student = reorderScheduleInStudent(state[payload.studentId], payload.scheduleId, payload.newIndex)
			return {...state, [student.id]: student}
		}
		case MOVE_SCHEDULE: {
			const student = moveScheduleInStudent(state[payload.studentId], payload.scheduleId, {year: payload.year, semester: payload.semester})
			return {...state, [student.id]: student}
		}

		case ADD_COURSE: {
			const student = addCourseToSchedule(state[payload.studentId], payload.scheduleId, payload.clbid)
			return {...state, [student.id]: student}
		}
		case REMOVE_COURSE: {
			const student = removeCourseFromSchedule(state[payload.studentId], payload.scheduleId, payload.clbid)
			return {...state, [student.id]: student}
		}
		case REORDER_COURSE: {
			const student = reorderCourseInSchedule(state[payload.studentId], payload.scheduleId, {clbid: payload.clbid, index: payload.index})
			return {...state, [student.id]: student}
		}
		case MOVE_COURSE: {
			const student = moveCourseToSchedule(state[payload.studentId], {fromScheduleId: payload.fromScheduleId, toScheduleId: payload.toScheduleId, clbid: payload.clbid})
			return {...state, [student.id]: student}
		}

		case SET_OVERRIDE: {
			const student = setOverrideOnStudent(state[payload.studentId], payload.key, payload.value)
			return {...state, [student.id]: student}
		}
		case REMOVE_OVERRIDE: {
			const student = removeOverrideFromStudent(state[payload.studentId], payload.override)
			return {...state, [student.id]: student}
		}
		case ADD_FABRICATION: {
			const student = addFabricationToStudent(state[payload.studentId], payload.fabrication)
			return {...state, [student.id]: student}
		}
		case REMOVE_FABRICATION: {
			const student = removeFabricationFromStudent(state[payload.studentId], payload.fabricationId)
			return {...state, [student.id]: student}
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

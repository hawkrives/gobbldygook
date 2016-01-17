import undoable from 'redux-undo'

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
} from '../../../models/student'

import {
	LOAD_STUDENTS,
	INIT_STUDENT,
	IMPORT_STUDENT,
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
} from '../constants'


const initialState = {}

export function studentReducer(student = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case CHANGE_NAME: {
			return changeStudentName(student, payload.name)
		}
		case CHANGE_ADVISOR: {
			return changeStudentAdvisor(student, payload.advisor)
		}
		case CHANGE_CREDITS_NEEDED: {
			return changeStudentCreditsNeeded(student, payload.credits)
		}
		case CHANGE_MATRICULATION: {
			return changeStudentMatriculation(student, payload.matriculation)
		}
		case CHANGE_GRADUATION: {
			return changeStudentGraduation(student, payload.graduation)
		}
		case CHANGE_SETTING: {
			return changeStudentSetting(student, payload.key, payload.value)
		}

		case ADD_AREA: {
			return addAreaToStudent(student, payload.area)
		}
		case REMOVE_AREA: {
			return removeAreaFromStudent(student, payload.areaQuery)
		}
		case REMOVE_AREAS: {
			for (const areaQuery of payload.areaQueries) {
				student = removeAreaFromStudent(student, areaQuery)
			}
			return student
		}

		case ADD_SCHEDULE: {
			return addScheduleToStudent(student, payload.schedule)
		}
		case DESTROY_SCHEDULE: {
			return destroyScheduleFromStudent(student, payload.scheduleId)
		}
		case DESTROY_SCHEDULES: {
			for (const id of payload.scheduleIds) {
				student = destroyScheduleFromStudent(student, id)
			}
			return student
		}
		case RENAME_SCHEDULE: {
			return renameScheduleInStudent(student, payload.scheduleId, payload.newTitle)
		}
		case REORDER_SCHEDULE: {
			return reorderScheduleInStudent(student, payload.scheduleId, payload.newIndex)
		}
		case MOVE_SCHEDULE: {
			return moveScheduleInStudent(student, payload.scheduleId, {year: payload.year, semester: payload.semester})
		}

		case ADD_COURSE: {
			return addCourseToSchedule(student, payload.scheduleId, payload.clbid)
		}
		case REMOVE_COURSE: {
			return removeCourseFromSchedule(student, payload.scheduleId, payload.clbid)
		}
		case REORDER_COURSE: {
			return reorderCourseInSchedule(student, payload.scheduleId, {clbid: payload.clbid, index: payload.index})
		}
		case MOVE_COURSE: {
			return moveCourseToSchedule(student, {fromScheduleId: payload.fromScheduleId, toScheduleId: payload.toScheduleId, clbid: payload.clbid})
		}

		case SET_OVERRIDE: {
			return setOverrideOnStudent(student, payload.key, payload.value)
		}
		case REMOVE_OVERRIDE: {
			return removeOverrideFromStudent(student, payload.override)
		}
		case ADD_FABRICATION: {
			return addFabricationToStudent(student, payload.fabrication)
		}
		case REMOVE_FABRICATION: {
			return removeFabricationFromStudent(student, payload.fabricationId)
		}

		default: {
			return student
		}
	}
}

export default undoable(studentReducer, {
	limit: 10,

	debug: true,

	filter: (action, currentState, previousState) => {
		// don't save histories when nothing has changed.
		return (currentState !== previousState)
	},

	// treat LOAD_STUDENTS as the beginning of history
	initTypes: ['@@redux/INIT', '@@INIT', LOAD_STUDENTS, INIT_STUDENT, IMPORT_STUDENT],
})

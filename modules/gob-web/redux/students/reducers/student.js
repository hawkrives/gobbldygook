import undoable from 'redux-undo'

import {Student} from '@gob/object-student'

import {
	LOAD_STUDENT,
	INIT_STUDENT,
	IMPORT_STUDENT,
	CHANGE_NAME,
	CHANGE_ADVISOR,
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

const initialState: Student = new Student()

export function studentReducer(state: Student = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case INIT_STUDENT: {
			if (action.error) {
				return state
			}
			return payload
		}

		case CHANGE_NAME: {
			return state.setName(payload.name)
		}
		case CHANGE_ADVISOR: {
			return state.setAdvisor(payload.advisor)
		}
		case CHANGE_MATRICULATION: {
			return state.setMatriculation(payload.matriculation)
		}
		case CHANGE_GRADUATION: {
			return state.setGraduation(payload.graduation)
		}
		case CHANGE_SETTING: {
			return state.setSetting(payload.key, payload.value)
		}

		case ADD_AREA: {
			return state.addArea(payload.area)
		}
		case REMOVE_AREA: {
			return state.removeArea(payload.areaQuery)
		}
		case REMOVE_AREAS: {
			for (const areaQuery of payload.areaQueries) {
				state = state.removeArea(areaQuery)
			}
			return state
		}

		case ADD_SCHEDULE: {
			return state.addSchedule(payload.schedule)
		}
		case DESTROY_SCHEDULE: {
			return state.destroySchedule(payload.scheduleId)
		}
		case DESTROY_SCHEDULES: {
			for (const id of payload.scheduleIds) {
				state = state.destroySchedule(state, id)
			}
			return state
		}
		case RENAME_SCHEDULE: {
			return state.renameSchedule(payload.scheduleId, payload.newTitle)
		}
		case REORDER_SCHEDULE: {
			return state.reorderSchedule(payload.scheduleId, payload.newIndex)
		}
		case MOVE_SCHEDULE: {
			return state.moveSchedule(payload.scheduleId, {
				year: payload.year,
				semester: payload.semester,
			})
		}

		case ADD_COURSE: {
			return state.addCourseToSchedule(payload.scheduleId, payload.clbid)
		}
		case REMOVE_COURSE: {
			return state.removeCourseFromSchedule(
				payload.scheduleId,
				payload.clbid,
			)
		}
		case REORDER_COURSE: {
			return state.reorderCourseInSchedule(payload.scheduleId, {
				clbid: payload.clbid,
				index: payload.index,
			})
		}
		case MOVE_COURSE: {
			return state.moveCourseToSchedule({
				fromScheduleId: payload.fromScheduleId,
				toScheduleId: payload.toScheduleId,
				clbid: payload.clbid,
			})
		}

		case SET_OVERRIDE: {
			return state.setOverride(payload.key, payload.value)
		}
		case REMOVE_OVERRIDE: {
			return state.removeOverride(payload.override)
		}
		case ADD_FABRICATION: {
			return state.addFabrication(payload.fabrication)
		}
		case REMOVE_FABRICATION: {
			return state.removeFabrication(payload.fabricationId)
		}

		default: {
			return state
		}
	}
}

export default undoable(studentReducer, {
	limit: 10,

	filter(action, currentState, previousState) {
		// only save history when something has changed.
		return currentState !== previousState
	},

	// treat LOAD_STUDENTS as the beginning of history
	initTypes: [
		'@@redux/INIT',
		'@@INIT',
		LOAD_STUDENT,
		INIT_STUDENT,
		IMPORT_STUDENT,
	],
})

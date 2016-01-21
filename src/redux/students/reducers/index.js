import omit from 'lodash/omit'
import {ActionTypes as UndoableActionTypes} from 'redux-undo'

import {
	INIT_STUDENT,
	IMPORT_STUDENT,
	DESTROY_STUDENT,

	BEGIN_LOAD_STUDENT,
	LOAD_STUDENT,
	BEGIN_GET_STUDENT_DATA,
	GET_STUDENT_DATA,
	BEGIN_CHECK_GRADUATABILITY,
	CHECK_GRADUATABILITY,
	BEGIN_VALIDATE_SCHEDULES,
	VALIDATE_SCHEDULES,

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

import studentWrapperReducer from './student-wrapper'


const initialState = {}

export default function studentsReducer(state = initialState, action) {
	const {type, payload, error} = action

	switch (type) {
		case INIT_STUDENT:
		case IMPORT_STUDENT: {
			if (error) {
				console.error(payload)
				return state
			}
			return {
				...state,
				[payload.id]: studentWrapperReducer(payload, action),
			}
		}

		case DESTROY_STUDENT: {
			if (error) {
				console.error(payload)
				return state
			}
			return omit(state, payload.studentId)
		}

		case BEGIN_LOAD_STUDENT:
		case LOAD_STUDENT:
		case BEGIN_GET_STUDENT_DATA:
		case GET_STUDENT_DATA:
		case BEGIN_CHECK_GRADUATABILITY:
		case CHECK_GRADUATABILITY:
		case BEGIN_VALIDATE_SCHEDULES:
		case VALIDATE_SCHEDULES: {
			if (error) {
				console.error(payload)
				return state
			}
			return {
				...state,
				[payload.id]: studentWrapperReducer(state[payload.id], action),
			}
		}

		case CHANGE_NAME:
		case CHANGE_ADVISOR:
		case CHANGE_CREDITS_NEEDED:
		case CHANGE_MATRICULATION:
		case CHANGE_GRADUATION:
		case CHANGE_SETTING:
		case ADD_AREA:
		case REMOVE_AREA:
		case REMOVE_AREAS:
		case ADD_SCHEDULE:
		case DESTROY_SCHEDULE:
		case DESTROY_SCHEDULES:
		case RENAME_SCHEDULE:
		case REORDER_SCHEDULE:
		case MOVE_SCHEDULE:
		case ADD_COURSE:
		case REMOVE_COURSE:
		case REORDER_COURSE:
		case MOVE_COURSE:
		case SET_OVERRIDE:
		case REMOVE_OVERRIDE:
		case ADD_FABRICATION:
		case REMOVE_FABRICATION: {
			if (error) {
				console.error(payload)
				return state
			}
			const id = payload.studentId
			return {
				...state,
				[id]: studentWrapperReducer(state[id], action),
			}
		}

		case UndoableActionTypes.UNDO:
		case UndoableActionTypes.REDO: {
			if (error) {
				console.error(payload)
				return state
			}
			return {
				...state,
				[payload.id]: studentWrapperReducer(state[payload.id], action),
			}
		}

		default: {
			return state
		}
	}
}

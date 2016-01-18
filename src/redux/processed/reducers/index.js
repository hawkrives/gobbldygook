import omit from 'lodash/object/omit'
import forEach from 'lodash/collection/forEach'

import singleReducer from './single'

import {
	BEGIN_GET_STUDENT_DATA,
	GET_STUDENT_DATA,
	BEGIN_CHECK_GRADUATABILITY,
	CHECK_GRADUATABILITY,
	BEGIN_VALIDATE_SCHEDULES,
	VALIDATE_SCHEDULES,
} from '../constants'

import {
	DESTROY_STUDENT,
	LOAD_STUDENT,
	LOAD_STUDENTS,
	INIT_STUDENT,
	IMPORT_STUDENT,
} from '../../students/constants'

const initialState = {}

export default function processedReducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case LOAD_STUDENT:
		case INIT_STUDENT:
		case IMPORT_STUDENT:
		case BEGIN_VALIDATE_SCHEDULES:
		case VALIDATE_SCHEDULES:
		case BEGIN_GET_STUDENT_DATA:
		case GET_STUDENT_DATA:
		case BEGIN_CHECK_GRADUATABILITY:
		case CHECK_GRADUATABILITY: {
			return {
				...state,
				[payload.id]: singleReducer(state[payload.id], action),
			}
		}

		case DESTROY_STUDENT: {
			return omit(state, [payload.studentId])
		}

		case LOAD_STUDENTS: {
			let state = {...state}
			forEach(payload, s => {
				state[s.id] = singleReducer(undefined, {...action, payload: s})
			})
			return state
		}

		default: {
			return state
		}
	}
}

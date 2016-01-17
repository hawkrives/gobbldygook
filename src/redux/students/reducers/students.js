import omit from 'lodash/object/omit'
import map from 'lodash/collection/map'
import zipObject from 'lodash/array/zipObject'

import {
	LOAD_STUDENTS,
	INIT_STUDENT,
	IMPORT_STUDENT,
	DESTROY_STUDENT,
} from '../constants'

import studentReducer from './student'


const initialState = {}

export function studentsReducer(state = initialState, action) {
	const {type, payload, error} = action

	switch (type) {
		case LOAD_STUDENTS: {
			return zipObject(map(payload, student => [
				student.id,
				studentReducer(student, action),
			]))
		}

		case INIT_STUDENT:
		case IMPORT_STUDENT: {
			if (error) {
				return state
			}
			return {
				...state,
				[payload.id]: studentReducer(payload, action),
			}
		}

		case DESTROY_STUDENT: {
			return omit(state, [payload.studentId])
		}

		default: {
			if (payload && 'studentId' in payload) {
				const id = payload.studentId
				return {
					...state,
					[id]: studentReducer(state[id], action),
				}
			}
			return state
		}
	}
}

import {
	BEGIN_GET_STUDENT_DATA,
	GET_STUDENT_DATA,
	BEGIN_CHECK_GRADUATABILITY,
	CHECK_GRADUATABILITY,
	BEGIN_VALIDATE_SCHEDULES,
	VALIDATE_SCHEDULES,
} from '../constants'

import {
	LOAD_STUDENT,
	LOAD_STUDENTS,
} from '../../students/constants'

const initialState = {
	isLoading: false,
	isChecking: false,
	isValdiating: false,
	data: {},
}

export default function singleReducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case BEGIN_GET_STUDENT_DATA: {
			return {...state, isLoading: true}
		}
		case GET_STUDENT_DATA: {
			return {...state, data: payload, isLoading: false}
		}

		case BEGIN_CHECK_GRADUATABILITY: {
			return {...state, isChecking: true}
		}
		case CHECK_GRADUATABILITY: {
			return {...state, data: payload, isChecking: false}
		}

		case BEGIN_VALIDATE_SCHEDULES: {
			return {...state, isValdiating: true}
		}
		case VALIDATE_SCHEDULES: {
			return {...state, data: payload, isValdiating: false}
		}

		case LOAD_STUDENT:
		case LOAD_STUDENTS: {
			return {...initialState, data: state}
		}

		default: {
			return state
		}
	}
}

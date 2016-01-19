import {
	BEGIN_VALIDATE_SCHEDULES,
	VALIDATE_SCHEDULES,
	BEGIN_GET_STUDENT_DATA,
	GET_STUDENT_DATA,
	BEGIN_CHECK_GRADUATABILITY,
	CHECK_GRADUATABILITY,
	BEGIN_LOAD_STUDENT,
	LOAD_STUDENT,
} from '../constants'


import studentReducer from './student'

const blankUndo = {present: {}, past: [], future: []}

const initialState = {
	isChecking: false,
	isFetching: false,
	isLoading: false,
	isValdiating: false,
	data: blankUndo,
}

export default function studentWrapperReducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case BEGIN_LOAD_STUDENT: {
			return {...state, isLoading: true}
		}
		case LOAD_STUDENT: {
			return {
				...state,
				isLoading: false,
				data: studentReducer({...blankUndo, present: payload}, action),
			}
		}

		case BEGIN_GET_STUDENT_DATA: {
			return {...state, isFetching: true}
		}
		case GET_STUDENT_DATA: {
			return {
				...state,
				data: studentReducer({...blankUndo, present: payload}, action),
				isFetching: false,
			}
		}

		case BEGIN_CHECK_GRADUATABILITY: {
			return {...state, isChecking: true}
		}
		case CHECK_GRADUATABILITY: {
			return {
				...state,
				data: studentReducer({...blankUndo, present: payload}, action),
				isChecking: false,
			}
		}

		case BEGIN_VALIDATE_SCHEDULES: {
			return {...state, isValdiating: true}
		}
		case VALIDATE_SCHEDULES: {
			return {
				...state,
				data: studentReducer({...blankUndo, present: payload}, action),
				isValdiating: false,
			}
		}


		default: {
			return {
				...state,
				data: studentReducer(state.data, action),
			}
		}
	}
}

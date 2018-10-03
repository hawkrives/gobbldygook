import {BEGIN_LOAD_STUDENT, LOAD_STUDENT} from '../constants'

import reducer from './student'

const initialState = {
	isLoading: false,
	data: {present: {}, past: [], future: []},
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
				data: reducer({...state.data, present: payload}, action),
			}
		}

		default: {
			return {
				...state,
				data: reducer(state.data, action),
			}
		}
	}
}

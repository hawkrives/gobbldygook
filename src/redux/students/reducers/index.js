import {
	BEGIN_LOADING,
} from '../constants'

import studentsReducer from './students'

const initialState = {
	isLoading: false,
	students: {},
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case BEGIN_LOADING: {
			return {...state, isLoading: true}
		}

		default: {
			return {students: studentsReducer(state.students, action), isLoading: false}
		}
	}
}

import {
	BEGIN_LOADING,
} from '../constants'

import studentsReducer from './students'

const initialState = {
	isLoading: false,
	data: {},
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case BEGIN_LOADING: {
			return {
				...state,
				isLoading: true,
			}
		}

		default: {
			return {
				data: studentsReducer(state.data, action),
				isLoading: false,
			}
		}
	}
}

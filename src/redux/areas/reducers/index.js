import {
	LOAD_ALL_AREAS,
	LOADING_AREAS,
} from '../constants'

const initialState = {areas: [], loading: false}

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case LOADING_AREAS: {
			return {...state, loading: true}
		}

		case LOAD_ALL_AREAS: {
			return {...state, areas: payload, loading: false}
		}

		default: {
			return state
		}
	}
}

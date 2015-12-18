import { LOAD_AREAS } from '../constants/areas'

const initialState = []

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case LOAD_AREAS: {
			return payload
		}

		default: {
			return state
		}
	}
}

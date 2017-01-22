import omit from 'lodash/omit'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
} from './constants'

const initialState = {}

export default function reducer(state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case LOG_MESSAGE: {
			return { ...state, [payload.id]: {
				message: payload.message,
				type: 'message',
			} }
		}

		case LOG_ERROR: {
			return { ...state, [payload.id]: {
				message: payload.error.message,
				type: 'error',
			} }
		}

		case START_PROGRESS: {
			return { ...state, [payload.id]: {
				message: payload.message,
				value: payload.value,
				max: payload.max,
				showButton: payload.showButton,
				type: 'progress',
			} }
		}

		case INCREMENT_PROGRESS: {
			// make a copy of the previous item
			const progress = { ...state[payload.id] }
			progress.value += payload.by
			progress.value = progress.value <= progress.max
				? progress.value
				: progress.max

			return { ...state, [payload.id]: progress }
		}

		case REMOVE_NOTIFICATION: {
			return omit(state, payload.id)
		}

		default: {
			return state
		}
	}
}

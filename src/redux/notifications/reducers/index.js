import clone from 'lodash/lang/clone'
import reject from 'lodash/collection/reject'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
} from '../constants'

const initialState = []

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case LOG_MESSAGE: {
			return [...state, {
				message: payload.message,
				type: 'message',
			}]
		}

		case LOG_ERROR: {
			return [...state, {
				message: payload.error.message,
				type: 'error',
			}]
		}

		case START_PROGRESS: {
			return [...state, {
				message: payload.message,
				value: payload.value,
				max: payload.max,
				showButton: payload.showButton,
				type: 'progress',
			}]
		}

		case INCREMENT_PROGRESS: {
			// make a copy of the previous item
			const progress = clone(state[payload.index])
			progress.value += payload.by
			progress.value = progress.value <= progress.max
				? progress.value
				: progress.max

			return [
				...state.slice(0, payload.index),
				progress,
				...state.slice(payload.index + 1),
			]
		}

		case REMOVE_NOTIFICATION: {
			return reject(state, (_, i) => i === payload.index)
		}

		default: {
			return state
		}
	}
}

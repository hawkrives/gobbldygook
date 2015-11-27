import findIndex from 'lodash/array/findIndex'
import clone from 'lodash/lang/clone'
import reject from 'lodash/collection/reject'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
} from '../constants/notifications'

const initialState = []

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case LOG_MESSAGE: {
			return [...state, {
				id: payload.id,
				message: payload.message,
				type: 'message',
			}]
		}

		case LOG_ERROR: {
			return [...state, {
				id: payload.id,
				message: payload.error.message,
				type: 'error',
			}]
		}

		case START_PROGRESS: {
			return [...state, {
				id: payload.id,
				message: payload.message,
				value: payload.value,
				max: payload.max,
				showButton: payload.showButton,
				type: 'progress',
			}]
		}

		case INCREMENT_PROGRESS: {
			// make a copy of the previous item
			const itemIndex = findIndex(state, {id: payload.id})
			const progress = clone(state[itemIndex])
			progress.value += payload.by
			progress.value = progress.value <= progress.max
				? progress.value
				: progress.max

			return [
				...state.slice(0, itemIndex),
				progress,
				...state.slice(itemIndex + 1),
			]
		}

		case REMOVE_NOTIFICATION: {
			return reject(state, {id: payload.id})
		}

		default: {
			return state
		}
	}
}

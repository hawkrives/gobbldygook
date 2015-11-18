import uniqueId from 'lodash/utility/uniqueId'
import findIndex from 'lodash/array/findIndex'
import clone from 'lodash/lang/clone'

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const LOG_MESSAGE = 'LOG_MESSAGE'
export const LOG_ERROR = 'LOG_ERROR'
export const START_PROGRESS = 'START_PROGRESS'
export const INCREMENT_PROGRESS = 'INCREMENT_PROGRESS'


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
			return state.delete(payload.id)
		}

		default: {
			return state
		}
	}
}


export function removeNotification(id) {
	return { type: REMOVE_NOTIFICATION, payload: { id } }
}

export function logMessage(id, message) {
	return { type: LOG_MESSAGE, payload: { id, message } }
}

export function logError({error, quiet=false, id=undefined}, ...args) {
	if (id === undefined) {
		id = uniqueId('error-')
	}
	if (!quiet && process.env.NODE_ENV !== 'test') {
		console.error(error, ...args)
	}
	return { type: LOG_ERROR, payload: { id, error, quiet, args } }
}

export function startProgress(id, message='', {value=0, max=1, showButton=false}={}) {
	return { type: START_PROGRESS, payload: { id, message, value, max, showButton } }
}

export function incrementProgress(id, by=1) {
	return { type: INCREMENT_PROGRESS, payload: { id, by } }
}

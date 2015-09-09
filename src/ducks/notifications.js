import {OrderedMap} from 'immutable'
import uniqueId from 'lodash/utility/uniqueId'

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const LOG_MESSAGE = 'LOG_MESSAGE'
export const LOG_ERROR = 'LOG_ERROR'
export const START_PROGRESS = 'START_PROGRESS'
export const INCREMENT_PROGRESS = 'INCREMENT_PROGRESS'


const initialState = OrderedMap({})

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	if (type === LOG_MESSAGE) {
		return state.set(payload.id, {id: payload.id, message: payload.message, type: 'message'})
	}

	else if (type === LOG_ERROR) {
		if (!payload.quiet && process.env.NODE_ENV !== 'test') {
			console.error(payload.error, ...payload.args)
		}
		return state.set(payload.id, {
			id: payload.id,
			message: payload.error.message,
			type: 'error',
		})
	}

	else if (type === START_PROGRESS) {
		return state.set(payload.id, {
			id: payload.id,
			message: payload.message,
			value: payload.value,
			max: payload.max,
			showButton: payload.showButton,
			type: 'progress',
		})
	}

	else if (type === INCREMENT_PROGRESS) {
		// make a copy of the previous item
		const progress = {...state.get(payload.id)}
		progress.value += payload.by
		progress.value = progress.value <= progress.max
			? progress.value
			: progress.max

		return state.set(payload.id, progress)
	}

	else if (type === REMOVE_NOTIFICATION) {
		return state.delete(payload.id)
	}

	else {
		return state
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
	return { type: LOG_ERROR, payload: { id, error, quiet, args } }
}

export function startProgress(id, message='', {value=0, max=1, showButton=false}={}) {
	return { type: START_PROGRESS, payload: { id, message, value, max, showButton } }
}

export function incrementProgress(id, by=1) {
	return { type: INCREMENT_PROGRESS, payload: { id, by } }
}

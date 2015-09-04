import {OrderedMap} from 'immutable'

import {notifications as C} from '../constants'

export default function notifications(state = OrderedMap(), action) {
	const {type, payload} = action

	switch (type) {
	case C.LOG_MESSAGE:
		return state.set(payload.id, {id: payload.id, message: payload.message, type: 'message'})

	case C.LOG_ERROR:
		if (!payload.quiet && process.env.NODE_ENV !== 'test') {
			console.error(payload.error, ...payload.args)
		}
		return state.set(payload.id, {
			id: payload.id,
			message: payload.error.message,
			type: 'error',
		})

	case C.START_PROGRESS:
		return state.set(payload.id, {
			id: payload.id,
			message: payload.message,
			value: payload.value,
			max: payload.max,
			showButton: payload.showButton,
			type: 'progress',
		})

	case C.INCREMENT_PROGRESS:
		const progress = {...state.get(payload.id)}
		progress.value += payload.by
		progress.value = progress.value <= progress.max
			? progress.value
			: progress.max

		return state.set(payload.id, progress)

	case C.REMOVE_NOTIFICATION:
		return state.delete(payload.id)

	default:
		return state
	}
}

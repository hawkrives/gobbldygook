import uniqueId from 'lodash/utility/uniqueId'

import * as C from '../constants/notification-constants'

export function removeNotification(id) {
	return { type: C.REMOVE_NOTIFICATION, payload: { id } }
}

export function logMessage(id, message) {
	return { type: C.LOG_MESSAGE, payload: { id, message } }
}

export function logError({error, quiet=false, id=undefined}, ...args) {
	if (id === undefined) {
		id = uniqueId('error-')
	}
	return { type: C.LOG_ERROR, payload: { id, error, quiet, args } }
}

export function startProgress(id, message='', {value=0, max=1, showButton=false}={}) {
	return { type: C.START_PROGRESS, payload: { id, message, value, max, showButton } }
}

export function incrementProgress(id, by=1) {
	return { type: C.INCREMENT_PROGRESS, payload: { id, by } }
}

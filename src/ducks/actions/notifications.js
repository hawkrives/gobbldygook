import uniqueId from 'lodash/utility/uniqueId'
import delay from 'delay'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
	REMOVE_NOTIFICATION_DELAYED,
} from '../constants/notifications'


export function removeNotification(id) {
	return { type: REMOVE_NOTIFICATION, payload: { id } }
}

export function removeNotificationAfterDelay(id, time) {
	return {
		type: REMOVE_NOTIFICATION_DELAYED,
		payload: delay(time).then(() => ({id})),
	}
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

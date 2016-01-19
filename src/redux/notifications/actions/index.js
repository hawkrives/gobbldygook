import delay from 'delay'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
} from '../constants'


export function removeNotification(index, delayBy=0) {
	if (delayBy) {
		return {
			type: REMOVE_NOTIFICATION,
			payload: delay(delayBy).then(() => ({ index })),
		}
	}
	return { type: REMOVE_NOTIFICATION, payload: { index } }
}

export function logMessage(message) {
	return { type: LOG_MESSAGE, payload: { message } }
}

export function logError({error, quiet=false}, ...args) {
	if (!quiet && !TESTING) {
		console.error(error, ...args)
	}
	return { type: LOG_ERROR, payload: { error, quiet, args } }
}

export function startProgress(message='', {value=0, max=1, showButton=false}={}) {
	return { type: START_PROGRESS, payload: { message, value, max, showButton } }
}

export function incrementProgress(index, by=1) {
	return { type: INCREMENT_PROGRESS, payload: { index, by } }
}

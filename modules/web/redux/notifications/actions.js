import Bluebird from 'bluebird'

import {
	LOG_MESSAGE,
	LOG_ERROR,
	START_PROGRESS,
	INCREMENT_PROGRESS,
	REMOVE_NOTIFICATION,
} from './constants'


export function removeNotification(id: string, delayBy: number = 0) {
	if (delayBy) {
		return {
			type: REMOVE_NOTIFICATION,
			payload: Bluebird.delay(delayBy, { id }),
		}
	}
	return { type: REMOVE_NOTIFICATION, payload: { id } }
}

export function logMessage(id: string, message: string) {
	return { type: LOG_MESSAGE, payload: { id, message } }
}

export function logError({id, error, quiet=false}: {id: string, error: Error, quiet?: boolean}, ...args?: any[]) {
	if (!quiet && !TESTING) {
		console.error(error, ...args)
	}
	return { type: LOG_ERROR, payload: { id, error, quiet, args } }
}

export function startProgress(id: string, message: string = '', {value=0, max=1, showButton=false}: {value?: number, max?: number, showButton?: boolean} = {}) {
	return { type: START_PROGRESS, payload: { id, message, value, max, showButton } }
}

export function incrementProgress(id: string, by: number = 1) {
	return { type: INCREMENT_PROGRESS, payload: { id, by } }
}

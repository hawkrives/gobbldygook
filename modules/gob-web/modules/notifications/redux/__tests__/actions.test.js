import {
	incrementProgress,
	logError,
	logMessage,
	removeNotification,
	startProgress,
} from '../actions'

import {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../constants'

describe('removeNotification action', () => {
	it('creates an action to remove a notification', () => {
		const id = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: {id},
		}

		expect(removeNotification(id)).toEqual(expectedAction)
	})

	it('creates an action to remove a notification after a delay', async () => {
		const id = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: Promise.resolve({id}),
		}

		let actual = removeNotification(id, 10)
		expect(actual.type).toBe(expectedAction.type)

		expect(await actual.payload).toEqual(await expectedAction.payload)
	})
})

describe('logMessage action', () => {
	it('creates an action to log a message', () => {
		const message = 'Message!'
		const id = 0
		const expectedAction = {
			type: LOG_MESSAGE,
			payload: {id, message},
		}

		expect(logMessage(id, message)).toEqual(expectedAction)
	})
})

describe('logError action', () => {
	it('creates an action to log an error', () => {
		const error = new Error('message!')
		const id = 0
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, args: []},
		}

		expect(logError({id, error})).toEqual(expectedAction)
	})

	it('passes along any other arguments', () => {
		const error = new Error('message!')
		const id = 0
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, args: ['arg']},
		}

		expect(logError({id, error}, 'arg')).toEqual(expectedAction)
	})
})

describe('startProgress action', () => {
	it('creates an action to begin a progress-bar', () => {
		const message = 'message'
		const id = 0
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message, max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id, message)).toEqual(expectedAction)
	})

	it('defaults "message" to an empty string', () => {
		const id = 0
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).toEqual(expectedAction)
	})

	it('defaults "value" to 0', () => {
		const id = 0
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).toEqual(expectedAction)
	})

	it('defaults "max" to 1', () => {
		const id = 0
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).toEqual(expectedAction)
	})
})

describe('incrementProgress action', () => {
	it('creates an action to increment a progress-bar', () => {
		const id = 1
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by: 1},
		}

		expect(incrementProgress(id)).toEqual(expectedAction)
	})

	it('increments their progress by an arbitrary amount', () => {
		const id = 1
		const by = 10
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by},
		}

		expect(incrementProgress(id, by)).toEqual(expectedAction)
	})
})

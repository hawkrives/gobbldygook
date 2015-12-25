import {expect} from 'chai'

import {
	incrementProgress,
	logError,
	logMessage,
	removeNotification,
	startProgress,
} from '../../src/ducks/actions/notifications'

import {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../../src/ducks/constants/notifications'

describe('removeNotification action', () => {
	it('creates an action to remove a notification', () => {
		const id = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: {id, delay: 0},
		}

		expect(removeNotification(id)).to.deep.equal(expectedAction)
	})

	it('creates an action to remove a notification after a delay', async () => {
		const id = 1
		const delay = 10
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: Promise.resolve({id, delay}),
		}

		let actual = removeNotification(id, delay)
		expect(actual.type).to.equal(expectedAction.type)

		let actualPayload = await actual.payload
		let expectedPayload = await expectedAction.payload
		expect(actualPayload).to.deep.equal(expectedPayload)
	})
})

describe('logMessage action', () => {
	it('creates an action to log a message', () => {
		const id = 1
		const message = 'Message!'
		const expectedAction = {
			type: LOG_MESSAGE,
			payload: {id, message},
		}

		expect(logMessage(id, message)).to.deep.equal(expectedAction)
	})
})

describe('logError action', () => {
	it('creates an action to log an error', () => {
		const id = 1
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, quiet: true, args: []},
		}

		expect(logError({id, error, quiet: true})).to.deep.equal(expectedAction)
	})

	it('passes along any other arguments', () => {
		const id = 1
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, quiet: true, args: ['arg']},
		}

		expect(logError({id, error, quiet: true}, 'arg')).to.deep.equal(expectedAction)
	})

	it('can be marked as "quiet"', () => {
		const id = 1
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, quiet: true, args: []},
		}

		expect(logError({id, error, quiet: true})).to.deep.equal(expectedAction)
	})
})

describe('startProgress action', () => {
	it('creates an action to begin a progress-bar', () => {
		const id = 1
		const message = 'message'
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message, max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id, message)).to.deep.equal(expectedAction)
	})

	it('defaults "message" to an empty string', () => {
		const id = 1
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).to.deep.equal(expectedAction)
	})

	it('defaults "value" to 0', () => {
		const id = 1
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).to.deep.equal(expectedAction)
	})

	it('defaults "max" to 1', () => {
		const id = 1
		const expectedAction = {
			type: START_PROGRESS,
			payload: {id, message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress(id)).to.deep.equal(expectedAction)
	})
})

describe('incrementProgress action', () => {
	it('creates an action to increment a progress-bar', () => {
		const id = 1
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by: 1},
		}

		expect(incrementProgress(id)).to.deep.equal(expectedAction)
	})

	it('increments their progress by an arbitrary amount', () => {
		const id = 1
		const by = 10
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by},
		}

		expect(incrementProgress(id, by)).to.deep.equal(expectedAction)
	})
})

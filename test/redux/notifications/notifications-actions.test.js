import {expect} from 'chai'

import {
	incrementProgress,
	logError,
	logMessage,
	removeNotification,
	startProgress,
} from '../../src/redux/notifications/actions'

import {
	INCREMENT_PROGRESS,
	LOG_ERROR,
	LOG_MESSAGE,
	REMOVE_NOTIFICATION,
	START_PROGRESS,
} from '../../src/redux/notifications/constants'

describe('removeNotification action', () => {
	it('creates an action to remove a notification', () => {
		const index = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: {index},
		}

		expect(removeNotification(index)).to.deep.equal(expectedAction)
	})

	it('creates an action to remove a notification after a delay', async () => {
		const index = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: Promise.resolve({index}),
		}

		let actual = removeNotification(index, 10)
		expect(actual.type).to.equal(expectedAction.type)

		let actualPayload = await actual.payload
		let expectedPayload = await expectedAction.payload
		expect(actualPayload).to.deep.equal(expectedPayload)
	})
})

describe('logMessage action', () => {
	it('creates an action to log a message', () => {
		const message = 'Message!'
		const expectedAction = {
			type: LOG_MESSAGE,
			payload: {message},
		}

		expect(logMessage(message)).to.deep.equal(expectedAction)
	})
})

describe('logError action', () => {
	it('creates an action to log an error', () => {
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {error, quiet: true, args: []},
		}

		expect(logError({error, quiet: true})).to.deep.equal(expectedAction)
	})

	it('passes along any other arguments', () => {
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {error, quiet: true, args: ['arg']},
		}

		expect(logError({error, quiet: true}, 'arg')).to.deep.equal(expectedAction)
	})

	it('can be marked as "quiet"', () => {
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {error, quiet: true, args: []},
		}

		expect(logError({error, quiet: true})).to.deep.equal(expectedAction)
	})
})

describe('startProgress action', () => {
	it('creates an action to begin a progress-bar', () => {
		const message = 'message'
		const expectedAction = {
			type: START_PROGRESS,
			payload: {message, max: 1, value: 0, showButton: false},
		}

		expect(startProgress(message)).to.deep.equal(expectedAction)
	})

	it('defaults "message" to an empty string', () => {
		const expectedAction = {
			type: START_PROGRESS,
			payload: {message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress()).to.deep.equal(expectedAction)
	})

	it('defaults "value" to 0', () => {
		const expectedAction = {
			type: START_PROGRESS,
			payload: {message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress()).to.deep.equal(expectedAction)
	})

	it('defaults "max" to 1', () => {
		const expectedAction = {
			type: START_PROGRESS,
			payload: {message: '', max: 1, value: 0, showButton: false},
		}

		expect(startProgress()).to.deep.equal(expectedAction)
	})
})

describe('incrementProgress action', () => {
	it('creates an action to increment a progress-bar', () => {
		const index = 1
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {index, by: 1},
		}

		expect(incrementProgress(index)).to.deep.equal(expectedAction)
	})

	it('increments their progress by an arbitrary amount', () => {
		const index = 1
		const by = 10
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {index, by},
		}

		expect(incrementProgress(index, by)).to.deep.equal(expectedAction)
	})
})

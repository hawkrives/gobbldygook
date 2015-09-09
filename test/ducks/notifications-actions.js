import {
	INCREMENT_PROGRESS,  incrementProgress,
	LOG_ERROR,           logError,
	LOG_MESSAGE,         logMessage,
	REMOVE_NOTIFICATION, removeNotification,
	START_PROGRESS,      startProgress,
} from '../../src/ducks/notifications'

describe('removeNotification', () => {
	it('should create an action to remove a notification', () => {
		const id = 1
		const expectedAction = {
			type: REMOVE_NOTIFICATION,
			payload: {id},
		}

		expect(removeNotification(id)).to.deep.equal(expectedAction)
	})
})

describe('logMessage', () => {
	it('should create an action to log a message', () => {
		const id = 1
		const message = 'Message!'
		const expectedAction = {
			type: LOG_MESSAGE,
			payload: {id, message},
		}

		expect(logMessage(id, message)).to.deep.equal(expectedAction)
	})
})

describe('logError', () => {
	it('should create an action to log an error', () => {
		const id = 1
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, quiet: false, args: []},
		}

		expect(logError({id, error})).to.deep.equal(expectedAction)
	})

	it('passes along any other arguments', () => {
		const id = 1
		const error = new Error('message!')
		const expectedAction = {
			type: LOG_ERROR,
			payload: {id, error, quiet: false, args: ['arg']},
		}

		expect(logError({id, error}, 'arg')).to.deep.equal(expectedAction)
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

describe('startProgress', () => {
	it('should create an action to begin a progress-bar', () => {
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

describe('incrementProgress', () => {
	it('should create an action to increment a progress-bar', () => {
		const id = 1
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by: 1},
		}

		expect(incrementProgress(id)).to.deep.equal(expectedAction)
	})

	it('can increment their progress by an arbitrary amount', () => {
		const id = 1
		const by = 10
		const expectedAction = {
			type: INCREMENT_PROGRESS,
			payload: {id, by},
		}

		expect(incrementProgress(id, by)).to.deep.equal(expectedAction)
	})
})

// test/flux/notificationStore.test.js
jest.dontMock('../../app/flux/notificationStore')

describe('notificationStore', () => {
	let notificationStore = undefined
	beforeEach(() => {
		notificationStore = require('../../app/flux/notificationStore')
	})

	it('logs messages', () => {
		notificationStore.logMessage(1, 'message')
		expect(notificationStore.notifications.get(1)).toEqual({id: 1, message: 'message', type: 'message'})
	})

	it('logs errors', () => {
		notificationStore.logError({message: 'error message', quiet: true})
		expect(notificationStore.notifications.get(0)).toEqual({id: 0, message: 'error message', type: 'error'})
	})

	it('logs progress bars', () => {
		notificationStore.startProgress(1, '', {value: 0, max: 1}, true)
		expect(notificationStore.notifications.get(1)).toEqual(
			{id: 1, message: '', type: 'progress', value: 0, max: 1, hideButton: true})
	})

	it('can increment their progress', () => {
		notificationStore.startProgress(1, '', {value: 0, max: 1}, true)
		notificationStore.incrementProgress(1)
		expect(notificationStore.notifications.get(1)).toEqual(
			{id: 1, message: '', type: 'progress', value: 1, max: 1, hideButton: true})
	})

	it('can increment their progress by an arbitrary amount', () => {
		notificationStore.startProgress(1, '', {value: 0, max: 1}, true)
		notificationStore.incrementProgress(1, 0.5)
		expect(notificationStore.notifications.get(1)).toEqual(
			{id: 1, message: '', type: 'progress', value: 0.5, max: 1, hideButton: true})
	})

	it('will not increment their progress past the set maximum', () => {
		notificationStore.startProgress(1, '', {value: 0, max: 1}, true)
		notificationStore.incrementProgress(1, 5)
		expect(notificationStore.notifications.get(1)).toEqual(
			{id: 1, message: '', type: 'progress', value: 1, max: 1, hideButton: true})
	})

	it('can remove notifications', () => {
		notificationStore.startProgress(1, '', {value: 0, max: 1}, true)
		notificationStore.removeNotification(1)
		expect(notificationStore.notifications.get(1)).not.toBeDefined()
	})
})

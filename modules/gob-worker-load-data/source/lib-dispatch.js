// @flow

function dispatch(type: string, action: string, ...args: any[]) {
	const toDispatch = {type: 'dispatch', message: {type, action, args}}
	self.postMessage(JSON.stringify(toDispatch))
}

export const quotaExceededError = (dbName: string) => {
	dispatch('notifications', 'logError', {
		id: 'db-storage-quota-exceeded',
		message: `The database "${dbName}" has exceeded its storage quota.`,
	})
}

export class Notification {
	id: string
	type: string
	length = 1
	store = 'notifications'

	constructor(notificationType: string, id?: string) {
		this.id = id || notificationType
		this.type = notificationType
	}

	start(length: number) {
		this.length = length

		const msg = `Loading ${this.type}`
		const args = {max: this.length, showButton: true}
		dispatch(this.store, 'startProgress', this.id, msg, args)
	}

	increment() {
		dispatch(this.store, 'incrementProgress', this.id)
	}

	remove() {
		dispatch(this.store, 'removeNotification', this.id, 1500)
	}
}

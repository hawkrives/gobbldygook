import Reflux from 'reflux'
import Immutable from 'immutable'
import uuid from 'node-uuid'

import notificationActions from './notificationActions'

let notificationStore = Reflux.createStore({
	listenables: notificationActions,

	init() {
		this.notifications = Immutable.Map()
		this.errorIndex = 0
	},

	getInitialState() {
		return this.notifications
	},

	_postChange() {
		this.errorIndex += 1
		this.trigger(this.notifications)
	},

	removeNotification(id, delay=0) {
		if (delay) {
			setTimeout(() => {
				console.log('removeNotification')
				this.notifications = this.notifications.delete(id)
				this._postChange()
			}, delay)
		}
		else {
			console.log('removeNotification')
			this.notifications = this.notifications.delete(id)
			this._postChange()
		}
	},

	logError(error) {
		console.log('logError')
		let id = this.errorIndex
		let notification = {id, message: error.message, type: 'error'}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	logMessage(id, message) {
		console.log('logMessage')
		let notification = {id, message, type: 'message'}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	startProgress(id, message='', progress={}, hideButton=false) {
		console.log('startProgress')
		let value = progress.value || 0
		let max = progress.max || 1
		let notification = {id, message, value, max, type: 'progress', hideButton}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	updateProgress(id, message, value, max) {
		console.log('updateProgress')
		this.notifications = this.notifications.mergeIn([id], {id, message, value, max})
		this._postChange()
	},
})

window.notifications = notificationStore

export default notificationStore

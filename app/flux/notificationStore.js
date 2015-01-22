import Reflux from 'reflux'
import Immutable from 'immutable'

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
				// console.log('removeNotification')
				this.notifications = this.notifications.delete(id)
				this._postChange()
			}, delay)
		}
		else {
			// console.log('removeNotification')
			this.notifications = this.notifications.delete(id)
			this._postChange()
		}
	},

	logError(error={}, ...args) {
		// console.log('logError')
		if (!error.quiet)
			console.error(error, ...args)
		let id = this.errorIndex
		let notification = {id, message: error.message, type: 'error'}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	logMessage(id, message) {
		// console.log('logMessage')
		let notification = {id, message, type: 'message'}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	startProgress(id, message='', progress={}, hideButton=false) {
		// console.log('startProgress')
		let value = progress.value || 0
		let max = progress.max || 1
		let notification = {id, message, value, max, type: 'progress', hideButton}
		this.notifications = this.notifications.set(id, notification)
		this._postChange()
	},

	incrementProgress(id, by) {
		let progress = this.notifications.get(id)
		progress.value += by || 1
		progress.value = progress.value <= progress.max ? progress.value : progress.max

		this.notifications = this.notifications.set(id, progress)
		this._postChange()
	},
})

window.notifications = notificationStore

export default notificationStore

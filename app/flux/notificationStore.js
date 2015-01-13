import Reflux from 'reflux'
import Immutable from 'immutable'

import notificationActions from './notificationActions'

let notificationStore = Reflux.createStore({
	listenables: notificationActions,

	init() {
		this.notifications = Immutable.Set()
	},

	getInitialState() {
		return this.notifications
	},

	_postChange() {
		this.trigger(this.notifications)
	},

	logError(error) {
		console.log('logError')
		this.notifications = this.notifications.add(error)
		this._postChange()
	},

	removeError(error) {
		console.log('removeError')
		this.notifications = this.notifications.delete(error)
		this._postChange()
	},
})

window.notifications = notificationStore

export default notificationStore

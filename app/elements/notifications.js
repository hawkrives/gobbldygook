import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import notificationStore from '../flux/notificationStore'
import notificationActions from '../flux/notificationActions'

let CloseNotificationButton = React.createClass({
	render() {
		return React.createElement('button', {className: 'close-notification'}, 'Close')
	}
})

let Notifications = React.createClass({
	mixins: [Reflux.listenTo(notificationStore, 'onNotification', 'onNotification')],

	onNotification(notifications) {
		// console.log('onNotification', notifications.toJS())
		this.setState({notifications})
	},

	getInitialState() {
		return {
			notifications: Immutable.List(),
		}
	},

	render() {
		// console.log('notifications', this.state.notifications.toJS())

		let notificationElements = this.state.notifications
			.toList()
			.map((err, idx) =>
				React.createElement('li',
					{key: idx, className: 'notification-capsule', onClick: () => notificationActions.removenotification(err)},
					err.message,
					React.createElement(CloseNotificationButton)))
			.toArray()

		return React.createElement('ul', {className: 'notification-list'}, notificationElements)
	},
})

export default Notifications

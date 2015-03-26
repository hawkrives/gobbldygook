import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import notificationStore from '../flux/notificationStore'

import Notation from './notification'

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
			.map((n) => React.createElement(Notification, Object.assign(n, {key: n.id})))
			.toArray()

		return React.createElement('ul', {className: 'notification-list'}, notificationElements)
	},
})

export default Notifications

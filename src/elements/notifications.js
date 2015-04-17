import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import notificationStore from '../flux/notificationStore'

import Notification from './notification'

let Notifications = React.createClass({
	mixins: [Reflux.listenTo(notificationStore, 'onNotification', 'onNotification')],

	onNotification(notifications) {
		// console.log('onNotification', notifications.toJS())
		this.setState({notifications})
	},

	getInitialState() {
		return {
			notifications: Immutable.Map(),
		}
	},

	render() {
		// console.log('Notifications#render')
		// console.log('notifications', this.state.notifications.toJS())
		let notificationElements = this.state.notifications
			.map(n => <Notification key={n.id} {...n} />)
			.toArray()

		return <ul className='notification-list'>{notificationElements}</ul>
	},
})

export default Notifications

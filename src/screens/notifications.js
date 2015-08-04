import React from 'react'
import Immutable from 'immutable'
import Reflux from 'reflux'

import notificationStore from '../flux/notification-store'

import Notification from '../components/notification'

let Notifications = React.createClass({
	mixins: [Reflux.listenTo(notificationStore, 'onNotification', 'onNotification')],

	getInitialState() {
		return {
			notifications: Immutable.Map(),
		}
	},

	onNotification(notifications) {
		// console.log('onNotification', notifications.toJS())
		this.setState({notifications})
	},

	render() {
		return (
			<ul className='notification-list'>
				{this.state.notifications
					.map(n => <Notification key={n.id} {...n} />)
					.toArray()}
			</ul>
		)
	},
})

export default Notifications

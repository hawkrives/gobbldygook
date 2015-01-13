import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import notificationStore from '../flux/notificationStore'
import notificationActions from '../flux/notificationActions'

let CloseNotificationButton = React.createClass({
	render() {
		return React.createElement('button', {className: 'close-notification', title: 'Close'})
	}
})

let Notification = React.createClass({
	propTypes: {
		id: React.PropTypes.any.isRequired,
		message: React.PropTypes.string.isRequired,
		value: React.PropTypes.number,
		max: React.PropTypes.number,
	},
	remove() {
		notificationActions.removeNotification(this.props.id)
	},
	render() {
		let message = React.createElement('h1',
			{className: 'notification-message'},
			this.props.message)
		let closeButton = React.createElement(CloseNotificationButton)

		let progressBar = null
		if (this.props.type === 'progress')
			progressBar = React.createElement('progress',
				{value: this.props.value, max: this.props.max})

		return React.createElement('li',
			{
				key: this.props.key || this.props.id,
				className: `notification-capsule  notification-type--${this.props.type}`,
				onClick: this.remove,
			},
			React.createElement('div',
				{className: 'notification-content'},
				message, progressBar),
			this.props.hideButton ? null : closeButton)
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
			.map((n) => React.createElement(Notification, Object.assign(n, {key: n.id})))
			.toArray()

		return React.createElement('ul', {className: 'notification-list'}, notificationElements)
	},
})

export default Notifications

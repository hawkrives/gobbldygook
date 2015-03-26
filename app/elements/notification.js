import React from 'react'

import notificationActions from '../flux/notificationActions'
import CloseNotificationButton from './closeNotificationButton'

let Notification = React.createClass({
	propTypes: {
		id: React.PropTypes.any.isRequired,
		message: React.PropTypes.string.isRequired,
		value: React.PropTypes.number,
		max: React.PropTypes.number,
		type: React.PropTypes.string.isRequired,
		key: React.PropTypes.string,
		hideButton: React.PropTypes.bool,
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
		if (this.props.type === 'progress') {
			let progressValue = Math.round(100 * (this.props.value / this.props.max))
			progressBar = React.createElement('div', {className: 'progress-container'},
				React.createElement('progress',
					{value: this.props.value, max: this.props.max}),
				React.createElement('output', null, `${progressValue}%`))
		}

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
	},
})

export default Notification

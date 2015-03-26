import React from 'react'

import notificationActions from '../flux/notificationActions'
import CloseNotificationButton from './closeNotificationButton'

class Notification extends React.Component {
	constructor(props) {
		super(props)
		this.remove = this.remove.bind(this)
	}

	remove() {
		notificationActions.removeNotification(this.props.id)
	}

	render() {
		let message = <h1 className='notification-message'>{this.props.message}</h1>
		let closeButton = <CloseNotificationButton />

		let progressBar = null
		if (this.props.type === 'progress') {
			let progressValue = Math.round(100 * (this.props.value / this.props.max))
			progressBar = <div className='progress-container'>
				<progress value={this.props.value} max={this.props.max} />
				<output>{progressValue}%</output>
			</div>
		}

		return <li key={this.props.key || this.props.id}
			className={`notification-capsule notification-type--${this.props.type}`}
			onClick={this.remove}>
			<div className='notification-content'>
				{message}
				{progressBar}
			</div>
			{this.props.hideButton ? null : closeButton}
		</li>
	}
}

Notification.propTypes = {
	id: React.PropTypes.any.isRequired,
	message: React.PropTypes.string.isRequired,
	value: React.PropTypes.number,
	max: React.PropTypes.number,
	type: React.PropTypes.string.isRequired,
	key: React.PropTypes.string,
	hideButton: React.PropTypes.bool,
}

export default Notification

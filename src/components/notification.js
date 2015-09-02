import React, {Component, PropTypes} from 'react'
import round from 'lodash/math/round'

import notificationActions from '../flux/notification-actions'

import Button from './button'
import ProgressBar from './progress-bar'

export default class Notification extends Component {
	static propTypes = {
		hideButton: PropTypes.bool,
		id: PropTypes.any.isRequired,
		max: PropTypes.number,
		message: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.number,
	}

	remove = () => {
		notificationActions.removeNotification(this.props.id)
	}

	render() {
		// console.log('Notification#render')
		const progressBar = (this.props.type === 'progress') && (
			<div className='progress-container'>
				<ProgressBar value={this.props.value} max={this.props.max} />
				<output>{round((this.props.value / this.props.max) * 100, 2)}%</output>
			</div>
		)

		return (
			<li className={`notification-capsule notification-type--${this.props.type}`}
				onClick={this.remove}>
				<div className='notification-content'>
					<h1 className='notification-message'>
						{this.props.message}
					</h1>
					{progressBar}
				</div>
				{!this.props.hideButton &&
				<Button className='close-notification'
					type='flat'
					title='Close'>
					×
				</Button>}
			</li>
		)
	}
}

import React, {Component, PropTypes} from 'react'
import round from 'lodash/math/round'
import Button from './button'
import ProgressBar from './progress-bar'
import './notification.scss'

export default class Notification extends Component {
	static propTypes = {
		hideButton: PropTypes.bool,
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		max: PropTypes.number,
		message: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.number,
	}

	render() {
		// console.log('Notification#render')
		const progressBar = (this.props.type === 'progress') && (
			<div className='progress-container'>
				<ProgressBar value={this.props.value} max={this.props.max} />
				<output>{round((this.props.value / this.props.max) * 100, 0)}%</output>
			</div>
		)

		return (
			<li className={`notification-capsule notification-type--${this.props.type}`}
				onClick={() => this.props.onClick(this.props.id)}>
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

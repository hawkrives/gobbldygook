const React = require('react')
const {PropTypes} = React
import {round} from 'lodash-es'
import Button from './button'
import ProgressBar from './progress-bar'
// import './notification.css'

export default function Notification(props) {
	// console.log('Notification#render')
	const progressBar = (props.type === 'progress') && (
		<div className='progress-container'>
			<ProgressBar value={props.value} max={props.max} />
			<output>{round((props.value / props.max) * 100, 0)}%</output>
		</div>
	)

	return (
		<li className={`notification-capsule notification-type--${props.type}`}
			onClick={props.onClose}>
			<div className='notification-content'>
				<h1 className='notification-message'>
					{props.message}
				</h1>
				{progressBar}
			</div>
			{!props.hideButton &&
			<Button className='close-notification'
				type='flat'
				title='Close'>
				×
			</Button>}
		</li>
	)
}
Notification.propTypes = {
	hideButton: PropTypes.bool,
	max: PropTypes.number,
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,
	value: PropTypes.number,
}

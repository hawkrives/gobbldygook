import React, {Component} from 'react'
import Immutable from 'immutable'

import notificationStore from '../flux/notification-store'

import Notification from '../components/notification'

import './notifications.scss'

export default class Notifications extends Component {
	static displayName = 'Notifications'

	constructor() {
		super()
		this.state = {
			notifications: Immutable.Map(),
		}
		this.onNotification = this.onNotification.bind(this)
	}

	componentDidMount() {
		notificationStore.emitter.on('change', this.onNotification)
		notificationStore.emitter.emit('change')
	}

	componentWillUnmount() {
		notificationStore.emitter.off('change', this.onNotification)
	}

	onNotification() {
		this.setState({
			notifications: notificationStore.notifications,
		})
	}

	render() {
		return (
			<ul className='notification-list'>
				{this.state.notifications
					.map(n => <Notification key={n.id} {...n} />)
					.toArray()}
			</ul>
		)
	}
}

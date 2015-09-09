import React, {Component, PropTypes} from 'react'
import {OrderedMap} from 'immutable'

import {connect} from 'react-redux'
import {removeNotification} from '../ducks/notifications'

import Notification from '../components/notification'

import './notifications.scss'

export class Notifications extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		notifications: PropTypes.instanceOf(OrderedMap).isRequired,
	}

	componentDidMount() {
		typeof window !== 'undefined' && (window.dispatch = this.props.dispatch)
	}

	componentWillUnmount() {
		typeof window !== 'undefined' && (delete window.dispatch)
	}

	render() {
		return (
			<ul className='notification-list'>
				{this.props.notifications.map(n =>
					<Notification {...n}
						key={n.id}
						onClick={id => this.props.dispatch(removeNotification(id))}
					/>)
				.toArray()}
			</ul>
		)
	}
}

function select(state) {
	return {
		notifications: state.notifications,
	}
}

export default connect(select)(Notifications)

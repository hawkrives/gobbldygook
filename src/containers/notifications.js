import React, {PropTypes} from 'react'

import map from 'lodash/collection/map'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {removeNotification} from '../redux/notifications/actions'

import Notification from '../components/notification'

import './notifications.scss'

export function Notifications({notifications, removeNotification}) {
	return (
		<ul className='notification-list'>
			{map(notifications, n =>
				<Notification
					{...n}
					key={n.id}
					onClick={id => removeNotification(id)}
				/>)}
		</ul>
	)
}

Notifications.propTypes = {
	notifications: PropTypes.array.isRequired,
	removeNotification: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	notifications: state.notifications,
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({removeNotification}, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)

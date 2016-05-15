import React, {PropTypes} from 'react'

import map from 'lodash/map'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { removeNotification } from 'src/redux/notifications/actions'

import Notification from 'src/components/notification'

import './notifications.css'

export const Notifications = ({notifications, removeNotification}) => (
	<ul className='notification-list'>
		{map(notifications, (n, i) =>
			<Notification {...n} key={i} onClose={() => removeNotification(i)} />
		)}
	</ul>
)

Notifications.propTypes = {
	notifications: PropTypes.object.isRequired,
	removeNotification: PropTypes.func.isRequired,
}

const selectState = state => ({
	notifications: state.notifications,
})

const selectDispatch = dispatch => ({
	...bindActionCreators({removeNotification}, dispatch),
})

export default connect(selectState, selectDispatch)(Notifications)

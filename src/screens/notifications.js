import React, {PropTypes} from 'react'

import map from 'lodash/collection/map'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from '../ducks/actions/notifications'

import Notification from '../components/notification'

import './notifications.scss'

export function Notifications({notifications, actions}) {
	return (
		<ul className='notification-list'>
			{map(notifications, n =>
				<Notification
					{...n}
					key={n.id}
					onClick={id => actions.removeNotification(id)}
				/>)}
		</ul>
	)
}

Notifications.propTypes = {
	actions: PropTypes.shape({
		removeNotification: PropTypes.func.isRequired,
	}).isRequired,
	notifications: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
	// selects some state that is relevant to this component, and returns it.
	// redux-react will bind it to props.
	return {
		notifications: state.notifications,
	}
}

function mapDispatchToProps(dispatch) {
	// binds the actions creators to this dispatch function.
	// then passes the keys of the returned object as props to the connect()-ed component
	return {
		actions: bindActionCreators(actionCreators, dispatch),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)

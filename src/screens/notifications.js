import React, {Component, PropTypes} from 'react'

import map from 'lodash/collection/map'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from '../ducks/actions/notifications'

import Notification from '../components/notification'

import './notifications.scss'

export class Notifications extends Component {
	static propTypes = {
		actions: PropTypes.shape({
			removeNotification: PropTypes.func.isRequired,
		}).isRequired,
		dispatch: PropTypes.func.isRequired,
		notifications: PropTypes.array.isRequired,
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
				{map(this.props.notifications, n =>
					<Notification {...n}
						key={n.id}
						onClick={id => this.props.actions.removeNotification(id)}
					/>)}
			</ul>
		)
	}
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
		dispatch: dispatch,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)

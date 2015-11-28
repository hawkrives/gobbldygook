import React, {Component, PropTypes} from 'react'
import Notifications from '../screens/notifications'
import {Provider} from 'react-redux'

export default class Root extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
	}

	render() {
		return (
			<Provider store={this.props.store}>
				<Notifications />
			</Provider>
		)
	}
}

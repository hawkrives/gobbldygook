import React, { Component, PropTypes } from 'react'
import {Provider} from 'react-redux'

// import DevTools from './devtools'
import Notifications from './notifications'

export default class Root extends Component {
	static propTypes = {
		children: PropTypes.node,
		store: PropTypes.object.isRequired,
	};

	render() {
		return (
			<Provider store={this.props.store}>
				<div id='app-wrapper'>
					{this.props.children}
					<Notifications />
					{/*<DevTools />*/}
				</div>
			</Provider>
		)
	}
}

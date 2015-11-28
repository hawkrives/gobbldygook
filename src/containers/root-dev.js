import React, { Component, PropTypes, cloneElement } from 'react'
import {Provider} from 'react-redux'

import DevTools from './devtools'
import App from './app'
import Notifications from './notifications'

export default class Root extends Component {
	static propTypes = {
		children: PropTypes.node,
		store: PropTypes.object.isRequired,
	}

	render() {
		return (
			<Provider store={this.props.store}>
				<div>
					<App>
						{cloneElement(this.props.children)}
					</App>
					<Notifications />
					<DevTools />
				</div>
			</Provider>
		)
	}
}

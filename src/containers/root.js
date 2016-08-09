import React, { PropTypes, cloneElement } from 'react'
import {Provider} from 'react-redux'
import Notifications from './notifications'

let DevTools
if (DEVELOPMENT) {
	DevTools = require('./devtools')
}

const Root = props => (
	<Provider store={props.store}>
		<div id='app-wrapper'>
			{cloneElement(props.children)}
			<Notifications />
			{DevTools ? <DevTools /> : null}
		</div>
	</Provider>
)

Root.propTypes = {
	children: PropTypes.node,
	store: PropTypes.object.isRequired,
}

export default Root

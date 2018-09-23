// @flow

import * as React from 'react'
import {Provider} from 'react-redux'
import Notifications from './modules/notifications'

const ReduxWrapper = (props: {children: React.Element<*>, store: Object}) => (
	<Provider store={props.store}>
		<div id="app-wrapper">
			{React.cloneElement(props.children)}
			<Notifications />
		</div>
	</Provider>
)

export default ReduxWrapper

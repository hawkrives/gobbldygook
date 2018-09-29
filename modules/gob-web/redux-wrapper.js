// @flow

import * as React from 'react'
import {Provider} from 'react-redux'
import Notifications from './modules/notifications'

const ReduxWrapper = (props: {children: React.Node, store: Object}) => (
	<Provider store={props.store}>
		<>
			{props.children}
			<Notifications />
		</>
	</Provider>
)

export default ReduxWrapper

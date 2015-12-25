import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Notifications from '../../src/screens/notifications'
import configureStore from './store.js'

const store = configureStore()
window.s = store

function NotificationsScreen() {
	return (
		<Provider store={store}>
			<div>
				<button onClick={() => {
					let id = uniqueId()
					store.dispatch(actions.logMessage(id, 'Message!'))
					store.dispatch(actions.removeNotification(id, 2000))
				}}>Add auto-closing notification</button>
				<Notifications />
			</div>
		</Provider>
	)
}

render(<NotificationsScreen />, document.getElementById('container'))

import uniqueId from 'lodash/utility/uniqueId'
import * as actions from '../../src/ducks/actions/notifications'
store.dispatch(actions.logMessage(uniqueId(), 'hi'))

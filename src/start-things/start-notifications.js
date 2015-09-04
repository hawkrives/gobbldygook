import React from 'react'
import Notifications from '../screens/notifications'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import gobbldygookApp from '../reducers'

const store = createStore(gobbldygookApp)

React.render(
	<Provider store={store}>
		{() => <Notifications />}
	</Provider>,
	document.getElementById('notifications')
)

import React from 'react'
import {render} from 'react-dom'
import Notifications from '../screens/notifications'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import gobbldygookApp from '../ducks/reducer'

const store = createStore(gobbldygookApp)

render(
	<Provider store={store}>
		<Notifications />
	</Provider>,
	document.getElementById('notifications')
)

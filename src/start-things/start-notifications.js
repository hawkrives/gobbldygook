import React from 'react'
import Notifications from '../screens/notifications'
import createStore from '../ducks/store'
import {Provider} from 'react-redux'
import gobbldygookApp from '../ducks/reducer'

const store = createStore(gobbldygookApp)

React.render(
	<Provider store={store}>
		{() => <Notifications />}
	</Provider>,
	document.getElementById('notifications')
)

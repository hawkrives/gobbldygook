import { combineReducers } from 'redux'

import notifications from './reducers/notifications'
import students from './reducers/students'

export default combineReducers({
	notifications,
	students,
})

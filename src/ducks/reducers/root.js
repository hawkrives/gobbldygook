import { combineReducers } from 'redux'

import notifications from './notifications'
import students from './students'

export default combineReducers({
	notifications,
	students,
})

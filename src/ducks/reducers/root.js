import { combineReducers } from 'redux'

import areas from './areas'
import notifications from './notifications'
import students from './students'

export default combineReducers({
	areas,
	notifications,
	students,
})

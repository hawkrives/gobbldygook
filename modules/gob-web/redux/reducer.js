// @flow
import {combineReducers} from 'redux'

import notifications from '../modules/notifications/redux/reducers'
import students from './students/reducers'

export default combineReducers({
	notifications,
	students,
})

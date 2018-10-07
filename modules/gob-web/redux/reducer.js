// @flow

import {combineReducers} from 'redux'

import notifications from '../modules/notifications/redux/reducers'
import {reducer as students} from './students/reducers'

export default combineReducers({
	notifications,
	students,
})

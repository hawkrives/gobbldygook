// @flow
import {combineReducers} from 'redux'

import notifications from '../modules/notifications/redux/reducers'
import search from '../modules/course-searcher/redux/reducers'
import students from './students/reducers'

export default combineReducers({
	notifications,
	students,
	search,
})

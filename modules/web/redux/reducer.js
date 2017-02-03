// @flow
import { combineReducers } from 'redux'

import areas from './areas/reducers'
import notifications from '../modules/notifications/redux/reducers'
import search from '../modules/course-searcher/redux/reducers'
import students from './students/reducers'

export default combineReducers({
	areas,
	notifications,
	students,
	search,
})

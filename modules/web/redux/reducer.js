// @flow
import { combineReducers } from 'redux'

import areas from './areas/reducers'
import notifications from './notifications/reducers'
import search from '../modules/course-searcher/search/reducers'
import students from './students/reducers'

export default combineReducers({
	areas,
	notifications,
	students,
	search,
})

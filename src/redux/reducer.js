import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import areas from './areas/reducers'
import notifications from './notifications/reducers'
import search from './search/reducers'
import students from './students/reducers'
import processed from './processed/reducers'

export default combineReducers({
	areas,
	notifications,
	processed,
	students,
	search,
	routing: routeReducer,
})

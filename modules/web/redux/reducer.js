// @flow
import { combineReducers } from 'redux'

import areas from './areas/reducers'
import notifications from './notifications/reducers'
import search from './search/reducers'
import students from './students/reducers'

export default combineReducers({
  areas,
  notifications,
  students,
  search,
})

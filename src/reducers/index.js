import {combineReducers} from 'redux'

import notifications from './notifications-reducer.js'


const gobbldygookApp = combineReducers({
	notifications,
})


export default gobbldygookApp

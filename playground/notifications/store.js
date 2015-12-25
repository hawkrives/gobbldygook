import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger({collapsed: true})

export const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		loggerMiddleware,
	)
)(createStore)

import notifications from '../../src/ducks/reducers/notifications'

import { combineReducers } from 'redux'

const reducer = combineReducers({
	notifications,
})

export default function configureStore() {
	return finalCreateStore(reducer)
}

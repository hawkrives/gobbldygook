// @flow

import {applyMiddleware, createStore, compose} from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import saveStudentsMiddleware from './middleware/save-student'
import {createLogger as loggingMiddleware} from 'redux-logger'
import rootReducer from './reducer'

// prettier-ignore
let middleware = [
	promiseMiddleware,
	thunkMiddleware,
	saveStudentsMiddleware,
]

if (!global.TESTING) {
	middleware.push(loggingMiddleware({duration: true, collapsed: true}))
}

const finalCreateStore = compose(
	applyMiddleware(...middleware),
	window && window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore)

export default function configureStore(initialState: {} = {}) {
	return finalCreateStore(rootReducer, initialState)
}

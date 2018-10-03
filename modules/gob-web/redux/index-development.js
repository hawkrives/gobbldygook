// @flow

import {applyMiddleware, createStore, compose} from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import {createLogger as loggingMiddleware} from 'redux-logger'
import rootReducer from './reducer'
import freezingMiddleware from 'redux-freeze'

// prettier-ignore
let middleware = [
	promiseMiddleware,
	thunkMiddleware,
	freezingMiddleware,
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

/* globals module */
import { applyMiddleware, createStore, compose } from 'redux/es'
const { persistState } = require('redux-devtools')
const promiseMiddleware = require('redux-promise')
const thunkMiddleware = require('redux-thunk')
const createLogger = require('redux-logger')
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import rootReducer from './reducer'
import DevTools from '../containers/devtools'
const freezingMiddleware = require('redux-freeze')

const loggerMiddleware = createLogger({collapsed: true})

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		freezingMiddleware,
		checkStudentsMiddleware,
		saveStudentsMiddleware,
		loggerMiddleware
	),
	DevTools.instrument(),
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)

	if (module.hot) {
		module.hot.accept('./reducer', () =>
			store.replaceReducer(require('./reducer').default))
	}

	return store
}

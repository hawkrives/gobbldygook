/* globals module */
import { applyMiddleware, createStore, compose } from 'redux'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import routerMiddleware from './middleware/router'
import rootReducer from './reducer'
import DevTools from '../containers/devtools'
import freezingMiddleware from 'redux-freeze'

const loggerMiddleware = createLogger({collapsed: true})

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		routerMiddleware,
		freezingMiddleware,
		// checkStudentsMiddleware
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
			store.replaceReducer(require('./reducer').default)
		)
	}

	return store
}

/* globals module */
import { applyMiddleware, createStore, compose } from 'redux'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import rootReducer from './reducer'
import freezingMiddleware from 'redux-freeze'

const loggerMiddleware = createLogger({ collapsed: true })

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		freezingMiddleware,
		checkStudentsMiddleware,
		saveStudentsMiddleware,
		loggerMiddleware
	),
	(window && window.devToolsExtension) ? window.devToolsExtension() : f => f,
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

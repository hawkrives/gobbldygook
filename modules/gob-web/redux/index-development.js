/* globals module */
import {applyMiddleware, createStore, compose} from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import rootReducer from './reducer'
import freezingMiddleware from 'redux-freeze'

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		freezingMiddleware,
		checkStudentsMiddleware,
		saveStudentsMiddleware,
	),
	window && window.devToolsExtension ? window.devToolsExtension() : f => f,
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)

	// if (module.hot) {
	// 	module.hot.accept('./reducer', () =>
	// 		store.replaceReducer(require('./reducer').default),
	// 	)
	// }

	return store
}

import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import rootReducer from './reducer'

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		checkStudentsMiddleware,
		saveStudentsMiddleware
	),
	(window && window.devToolsExtension) ? window.devToolsExtension() : f => f
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}

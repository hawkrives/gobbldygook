import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import saveStudentsMiddleware from './middleware/save-students'
import routerMiddleware from './middleware/router'
import rootReducer from './reducer'

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		routerMiddleware,
		saveStudentsMiddleware
	)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import saveStudentsMiddleware from '../middleware/save-students'
import rootReducer from '../reducers/root'

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		saveStudentsMiddleware)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

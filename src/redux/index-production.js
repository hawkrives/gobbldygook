import { applyMiddleware, createStore, compose } from 'redux/es'
const promiseMiddleware = require('redux-promise')
const thunkMiddleware = require('redux-thunk')
import checkStudentsMiddleware from './middleware/check-students'
import saveStudentsMiddleware from './middleware/save-students'
import rootReducer from './reducer'

const finalCreateStore = compose(
	applyMiddleware(
		promiseMiddleware,
		thunkMiddleware,
		checkStudentsMiddleware,
		saveStudentsMiddleware
	)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

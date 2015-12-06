import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/root'

const finalCreateStore = compose(
	applyMiddleware(promiseMiddleware, thunkMiddleware)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

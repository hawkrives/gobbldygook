import { applyMiddleware, createStore, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import rootReducer from '../reducers/root'

const finalCreateStore = compose(
	applyMiddleware(promiseMiddleware)
)(createStore)

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

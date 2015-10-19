import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'

export default applyMiddleware(
	thunk,
	promise,
)(createStore)

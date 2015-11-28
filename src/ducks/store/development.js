/* globals module */
import { applyMiddleware, createStore, compose } from 'redux'
import { persistState } from 'redux-devtools'
import promiseMiddleware from 'redux-promise'
import rootReducer from '../reducers/root'
import DevTools from '../../containers/devtools'

const finalCreateStore = compose(
	applyMiddleware(promiseMiddleware),
	DevTools.instrument(),
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore)

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState)

	if (module.hot) {
		module.hot.accept('../reducers/root', () =>
			store.replaceReducer(require('../reducers/root'))
		)
	}

	return store
}

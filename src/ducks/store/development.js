/* globals module */
import { createStore, compose } from 'redux'
import { persistState } from 'redux-devtools'
import rootReducer from '../reducers/root'
import DevTools from '../../containers/devtools'

const finalCreateStore = compose(
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

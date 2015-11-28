import { createStore } from 'redux'
import rootReducer from '../reducers/root'

const finalCreateStore = createStore

export default function configureStore(initialState) {
	return finalCreateStore(rootReducer, initialState)
}

import Reflux from 'reflux'
import Immutable from 'immutable'

import errorActions from './errorActions'

let errorStore = Reflux.createStore({
	listenables: errorActions,

	init() {
		this.errors = Immutable.Stack()
	},

	getInitialState() {
		return this.errors
	},

	logError(error, opts) {
		let {msg, style} = opts || {msg: '', style: ''}
		console.debug(error)
	},
})

window.errors = errorStore

export default errorStore

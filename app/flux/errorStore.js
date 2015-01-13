import Reflux from 'reflux'
import Immutable from 'immutable'

import errorActions from './errorActions'

let errorStore = Reflux.createStore({
	listenables: errorActions,

	init() {
		this.errors = Immutable.Set()
	},

	getInitialState() {
		return this.errors
	},

	_postChange() {
		this.trigger(this.errors)
	},

	logError(error) {
		console.log('logError')
		this.errors = this.errors.add(error)
		this._postChange()
	},

	removeError(error) {
		console.log('removeError')
		this.errors = this.errors.delete(error)
		this._postChange()
	}
})

window.errors = errorStore

export default errorStore

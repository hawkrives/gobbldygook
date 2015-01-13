import Reflux from 'reflux'

let errorActions = Reflux.createActions([
	'logError',
	'removeError',
])

window.errora = errorActions

export default errorActions

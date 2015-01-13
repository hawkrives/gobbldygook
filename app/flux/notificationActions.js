import Reflux from 'reflux'

let notificationActions = Reflux.createActions([
	'logError',
	'removeError',
])

window.notificationa = notificationActions

export default notificationActions

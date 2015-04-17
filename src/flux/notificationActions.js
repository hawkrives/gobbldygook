import Reflux from 'reflux'

let notificationActions = Reflux.createActions([
	'removeNotification',
	'logError',
	'logMessage',
	'startProgress',
	'incrementProgress',
])

window.notificationa = notificationActions

export default notificationActions

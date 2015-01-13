import Reflux from 'reflux'

let notificationActions = Reflux.createActions([
	'removeNotification',
	'logError',
	'logMessage',
	'startProgress',
	'updateProgress',
])

window.notificationa = notificationActions

export default notificationActions

import Reflux from 'reflux'

let notificationActions = Reflux.createActions([
	'removeNotification',
	'logError',
	'logMessage',
	'startProgress',
	'incrementProgress',
])

export default notificationActions

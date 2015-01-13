import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import errorStore from '../flux/errorStore'
import errorActions from '../flux/errorActions'

let CloseNotificationButton = React.createClass({
	render() {
		return React.createElement('button', {className: 'close-notification'}, 'Close')
	}
})

let Notifications = React.createClass({
	mixins: [Reflux.listenTo(errorStore, 'onError', 'onError')],

	onError(errors) {
		// console.log('onError', errors.toJS())
		this.setState({errors})
	},

	getInitialState() {
		return {
			errors: Immutable.List(),
		}
	},

	render() {
		// console.log('errors', this.state.errors.toJS())

		let errorElements = this.state.errors
			.toList()
			.map((err, idx) =>
				React.createElement('li',
					{key: idx, className: 'notification-capsule', onClick: () => errorActions.removeError(err)},
					err.message,
					React.createElement(CloseNotificationButton)))
			.toArray()

		return React.createElement('ul', {className: 'notification-list'}, errorElements)
	},
})

export default Notifications

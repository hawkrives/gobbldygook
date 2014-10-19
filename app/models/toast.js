'use strict';

import * as _ from 'lodash'
import * as React from 'react/addons'
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

var Toast = React.createClass({
	onClick() {
		this.remove()
	},
	remove() {
		this.props.notification.remove()
	},
	render() {
		var textProgress = null
		var progressBar = null

		var details = this.props.notification.val()

		if (details.hasProgress) {
			textProgress = React.DOM.span(
				null,
				' (',
				React.DOM.span(null, details.progressValue || 0),
				'/',
				React.DOM.span(null, details.maxProgressValue || 100),
				')'
			)
			progressBar = React.DOM.progress({
				value: details.progressValue || 0,
				max: details.maxProgressValue || 100
			})

			if (details.progressValue >= details.maxProgressValue) {
				setTimeout(this.remove, 2500)
			}
		} else {
			setTimeout(this.remove, 5000)
		}

		return React.DOM.li(
			{
				className: 'toast',
				onClick: this.onClick,
				onTouch: this.onClick
			},
			React.DOM.h1(
				null,
				details.message || '',
				textProgress
			),
			progressBar
		)
	}
})

var NotificationContainer = React.createClass({
	render() {
		var notifications = this.props.notifications ? this.props.notifications : []
		var notificationComponents = notifications.map(function(notification, index) {
			return Toast({key: index, notification: notification})
		})
		return (
			ReactCSSTransitionGroup(
				{
					transitionName: 'notification',
					className: 'notifications',
					component: React.DOM.ul,
				},
				notificationComponents
			)
		)
	}
})

export {NotificationContainer}
export default Toast

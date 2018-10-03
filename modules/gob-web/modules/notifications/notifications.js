// @flow
import React from 'react'
import styled from 'styled-components'
import map from 'lodash/map'
import {connect} from 'react-redux'
import {removeNotification} from './redux/actions'
import type {Notification as Notif} from './types'
import Notification from './notification'

const NotificationList = styled.ul`
	position: fixed;
	bottom: 15px;
	left: 15px;

	padding: 0;
	margin: 0;
	list-style: none;
	z-index: 10;
`

type Props = {
	notifications: {[key: string]: Notif},
	removeNotification: (id: string) => any,
}

export const Notifications = ({notifications, removeNotification}: Props) => (
	<NotificationList>
		{map(notifications, (n, i) => (
			<Notification
				notification={n}
				key={i}
				onClose={() => removeNotification(i)}
			/>
		))}
	</NotificationList>
)

export default connect(
	state => ({notifications: state.notifications}),
	{removeNotification},
)(Notifications)

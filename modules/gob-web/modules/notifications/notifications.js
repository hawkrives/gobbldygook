// @flow
import React from 'react'
import styled from 'styled-components'
import values from 'lodash/values'
import sortBy from 'lodash/sortBy'
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
		{sortBy(values(notifications), n => n.id).map(n => (
			<Notification
				notification={n}
				key={n.id}
				onClose={() => removeNotification(n.id)}
			/>
		))}
	</NotificationList>
)

export default connect(
	state => ({notifications: state.notifications}),
	{removeNotification},
)(Notifications)

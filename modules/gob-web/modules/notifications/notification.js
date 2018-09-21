// @flow
import React from 'react'
import round from 'lodash/round'
import Button from '../../components/button'
import BasicProgressBar from '../../components/progress-bar'
import styled from 'styled-components'
import debug from 'debug'
const log = debug('web:react')
import {type Notification as NotificationType} from './types'
import * as theme from '../../theme'

type Props = {
	onClose: () => any,
	notification: NotificationType,
}

let ProgressContainer = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`

let ProgressBar = styled(BasicProgressBar)`
	flex: 1;
	height: 10px;
	overflow: hidden;
	border: solid 1px ${theme.gray300};
	background-color: transparent;
	color: ${theme.gray300};
`

let Percentage = styled('output')`
	color: ${theme.gray300};
	margin-left: 0.5em;
	font-feature-settings: 'lnum';
`

let Message = styled('h1')`
	font-weight: 500;
	font-size: 1em;
	margin: 0;
`

let Content = styled('div')`
	flex: 1;
`

let CloseButton = styled(Button)`
	margin-left: 0.9em;
	padding: 2px 6px 1px;

	&:hover {
		background-color: ${theme.white};
		color: ${theme.black};
	}
`

const Capsule = styled('li')`
	position: relative;

	display: flex;
	flex-flow: row nowrap;
	align-items: center;

	background: ${theme.black};
	color: ${theme.gray300};

	font-size: 0.9em;

	min-height: 46px;
	min-width: 288px;
	max-width: 350px;

	padding: 0.9em;

	box-shadow: 0 2px 6px ${theme.gray700};
	border-radius: 2px;

	& + & {
		margin-top: 1em;
	}
`

const ErrorCapsule = styled(Capsule)`
	background: ${theme.red};
	color: ${theme.white};

	${CloseButton}:hover {
		border-color: ${theme.red900};
		color: ${theme.red900};
	}
`

export default function Notification(props: Props) {
	const {notification, onClose} = props
	const {type, value, hideButton, max, message} = notification

	log('Notification#render')
	const progressBar = type === 'progress' && (
		<ProgressContainer>
			<ProgressBar value={value} max={max} />
			<Percentage>{round((value / max) * 100, 0)}%</Percentage>
		</ProgressContainer>
	)

	let CapsuleEl = type === 'error' ? ErrorCapsule : Capsule

	return (
		<CapsuleEl onClick={onClose}>
			<Content>
				<Message>{message}</Message>
				{progressBar}
			</Content>
			{!hideButton && (
				<CloseButton type="flat" title="Close">
					×
				</CloseButton>
			)}
		</CapsuleEl>
	)
}

// @flow

import React from 'react'
import {Card} from './card'
import {RaisedButton} from './button'
import styled from 'styled-components'

let CenteredCard = styled(Card)`
	margin: 3rem auto 1rem;
	max-width: 30em;
	padding: 2rem;
`

export function LoadingComponent(props: {
	error: ?Error,
	retry: () => any,
	timedOut: boolean,
	pastDelay: boolean,
}) {
	if (props.error) {
		return (
			<CenteredCard>
				<p>Error!</p>
				<RaisedButton onClick={props.retry}>Retry</RaisedButton>
			</CenteredCard>
		)
	}

	if (props.timedOut) {
		return (
			<CenteredCard>
				<p>Taking a long time…</p>
				<RaisedButton onClick={props.retry}>Retry</RaisedButton>
			</CenteredCard>
		)
	}

	if (props.pastDelay) {
		return (
			<CenteredCard>
				<p>Loading…</p>
			</CenteredCard>
		)
	}

	return null
}

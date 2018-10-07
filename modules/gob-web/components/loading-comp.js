// @flow

import React from 'react'

export function LoadingComponent(props: {
	error: ?Error,
	retry: () => any,
	timedOut: boolean,
	pastDelay: boolean,
}) {
	if (props.error) {
		return (
			<p>
				Error! <button onClick={props.retry}>Retry</button>
			</p>
		)
	}

	if (props.timedOut) {
		return (
			<p>
				Taking a long time… <button onClick={props.retry}>Retry</button>
			</p>
		)
	}

	if (props.pastDelay) {
		return <p>Loading…</p>
	}

	return null
}

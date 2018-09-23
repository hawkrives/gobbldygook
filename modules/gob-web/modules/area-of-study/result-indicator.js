// @flow

import React from 'react'
import {Icon} from '../../components/icon'
import {checkmark, close} from '../../icons/ionicons'

export default function ResultIndicator({result}: {result?: boolean}) {
	return (
		<Icon
			className={`result-indicator ${
				result
					? 'result-indicator--success'
					: 'result-indicator--failure'
			}`}
		>
			{result ? checkmark : close}
		</Icon>
	)
}

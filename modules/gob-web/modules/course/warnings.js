// @flow

import React from 'react'
import styled from 'styled-components'
import {PlainList, ListItem} from '../../components/list'
import {Icon} from '../../components/icon'
import {
	iosClockOutline,
	iosCalendarOutline,
	alertCircled,
} from '../../icons/ionicons'
import * as theme from '../../theme'
import type {WarningType} from '@gob/object-student'
import {List} from 'immutable'

const WarningList = styled(PlainList)`
	font-size: 0.85em;
	font-variant-numeric: oldstyle-nums;
	display: flex;
	flex-flow: row wrap;
`

const WarningItem = styled(ListItem)`
	display: inline-flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
	max-width: 100%;

	padding: 0.125em 0.35em;
	margin-bottom: 0.1em;
	border-radius: 0.25em;
	background-color: var(--amber-200);
`

const WarningIcon = styled(Icon)`
	margin-right: 0.35em;
	flex-shrink: 0;
`

const WarningMessage = styled.span`
	flex: 1;
	${theme.truncate};
`

const icons = {
	'time-conflict': iosClockOutline,
	'invalid-semester': iosCalendarOutline,
	'invalid-year': alertCircled,
}

type Props = {
	warnings: List<WarningType>,
}

export default class CourseWarnings extends React.Component<Props> {
	render() {
		let {warnings = List()} = this.props

		if (!warnings.size) {
			return null
		}

		return (
			<WarningList>
				{warnings
					.map(w => (
						<WarningItem title={w.msg} key={w.msg}>
							<WarningIcon>{icons[w.type]}</WarningIcon>
							<WarningMessage>{w.msg}</WarningMessage>
						</WarningItem>
					))
					.toArray()}
			</WarningList>
		)
	}
}

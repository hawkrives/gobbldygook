// @flow

import React from 'react'
import styled from 'styled-components'
import {PlainList, ListItem} from '../../components/list'
import Icon from '../../components/icon'
import {
	iosClockOutline,
	iosCalendarOutline,
	alertCircled,
} from '../../icons/ionicons'
import * as theme from '../../theme'
import type {WarningType} from '@gob/object-student'

const WarningList = styled(PlainList)`
	font-size: 0.85em;
	font-feature-settings: 'onum';
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
	background-color: ${theme.amber200};
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
	warnings: Array<?WarningType>,
}

export default class CourseWarnings extends React.Component<Props> {
	render() {
		if (!this.props.warnings) {
			return null
		}

		// $FlowFixMe at some point, flow should be able to determine that the filter will not return any nullable elements
		let warnings: Array<WarningType> = (this.props.warnings.filter(
			w => w && w.warning === true,
		): Array<any>)

		if (!warnings.length) {
			return null
		}

		return (
			<WarningList>
				{warnings.map(w => (
					<WarningItem key={w.msg}>
						<WarningIcon>{icons[w.type]}</WarningIcon>
						<WarningMessage>{w.msg}</WarningMessage>
					</WarningItem>
				))}
			</WarningList>
		)
	}
}

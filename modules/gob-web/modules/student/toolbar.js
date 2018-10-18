// @flow

import * as React from 'react'
import styled, {css} from 'styled-components'
import {
	Avatar,
	IconButton,
	Tooltip,
	Popover,
	Button,
	BackButton,
	SearchInput,
} from 'evergreen-ui'
import {AreaOfStudyBar} from './area-of-study-bar'

const Container = styled.nav`
	margin: 0;

	display: flex;
	flex-flow: row nowrap;
`

const Spacer = styled.div`
	${props =>
		props.static &&
		css`
			width: 24px;
		`};

	${props =>
		props.flex &&
		css`
			flex: 1;
		`};
`

class StudentSummaryBar extends React.Component {
	render() {
		let {student} = this.props
		return (
			<>
				<Avatar name={student.name} size={24} />

				<AreaOfStudyBar student={student} />
			</>
		)
	}
}

export class StudentToolbar extends React.Component {
	render() {
		let {student} = this.props

		return (
			<Container>
				<Tooltip content="Back to student list">
					<BackButton />
				</Tooltip>

				<Spacer static />

				<Tooltip content="Undo">
					<IconButton icon="undo" />
				</Tooltip>
				<Tooltip content="Redo">
					<IconButton icon="redo" />
				</Tooltip>

				<Spacer static />

				<StudentSummaryBar student={student} />

				<Spacer flex />

				<SearchInput placeholder="Find a course" />

				<Spacer flex />

				<Tooltip content="Share student">
					<IconButton icon="share" />
				</Tooltip>
			</Container>
		)
	}
}

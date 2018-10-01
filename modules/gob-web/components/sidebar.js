// @flow

import * as React from 'react'
import {Link} from '@reach/router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon} from './icon'
import {Toolbar, ToolbarButton} from './toolbar'
import Separator from './separator'
import {undo, redo} from '../redux/students/actions/undo'
import {
	iosUndo,
	iosUndoOutline,
	iosRedo,
	iosRedoOutline,
	iosSearch,
	iosPeopleOutline,
	iosUploadOutline,
	grid,
} from '../icons/ionicons'
import styled from 'styled-components'
import type {HydratedStudentType} from '@gob/object-student'
import type {Undoable} from '../types'

type Props = {
	redo: string => any,
	removeCourse: Function,
	student: Undoable<HydratedStudentType>,
	undo: string => any,

	search?: boolean,
	share?: boolean,
	backTo?: 'picker' | 'overview',
}

const StudentButtonsToolbar = styled(Toolbar)`
	margin-bottom: 0.5em;
	flex-shrink: 0;
`

export function SidebarToolbar(props: Props) {
	const {undo, redo, search = true, share = true, backTo = 'picker'} = props

	let student = props.student.present
	let studentId = student.id
	let canUndo = props.student.past.length > 0
	let canRedo = props.student.future.length > 0

	let toPicker = backTo === 'picker'
	let toOverview = backTo === 'overview'

	return (
		<StudentButtonsToolbar>
			{toPicker ? (
				<ToolbarButton as={Link} to="/" title="Students">
					<Icon block large>
						{iosPeopleOutline}
					</Icon>
				</ToolbarButton>
			) : toOverview ? (
				<ToolbarButton as={Link} to="../.." title="Courses">
					<Icon block large>
						{grid}
					</Icon>
				</ToolbarButton>
			) : (
				<div />
			)}

			<Separator type="spacer" />

			{search ? (
				<ToolbarButton as={Link} to="./search" title="Search">
					<Icon block large>
						{iosSearch}
					</Icon>
				</ToolbarButton>
			) : (
				<div />
			)}

			<ToolbarButton
				title="Undo"
				onClick={() => undo(studentId)}
				disabled={!canUndo}
			>
				<Icon block large>
					{!canUndo ? iosUndoOutline : iosUndo}
				</Icon>
			</ToolbarButton>
			<ToolbarButton
				title="Redo"
				onClick={() => redo(studentId)}
				disabled={!canRedo}
			>
				<Icon block large>
					{!canRedo ? iosRedoOutline : iosRedo}
				</Icon>
			</ToolbarButton>

			<Separator type="spacer" />

			{share ? (
				<ToolbarButton as={Link} to="?share" title="Share">
					<Icon block large>
						{iosUploadOutline}
					</Icon>
				</ToolbarButton>
			) : (
				<div />
			)}
		</StudentButtonsToolbar>
	)
}

const mapDispatch = dispatch => bindActionCreators({undo, redo}, dispatch)

// $FlowFixMe
export const ConnectedSidebarToolbar = connect(
	undefined,
	mapDispatch,
)(SidebarToolbar)

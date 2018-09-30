// @flow

import * as React from 'react'
import {Link} from '@reach/router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Icon} from './icon'
import {Toolbar, ToolbarButton} from './toolbar'
import Separator from './separator'
import CourseRemovalBox from './course-removal-box'
import {undo, redo} from '../redux/students/actions/undo'
import {removeCourse} from '../redux/students/actions/courses'
import {
	iosUndo,
	iosUndoOutline,
	iosRedo,
	iosRedoOutline,
	iosSearch,
	iosPeopleOutline,
	iosUploadOutline,
} from '../icons/ionicons'
import styled from 'styled-components'
import type {HydratedStudentType} from '@gob/object-student'
import type {Undoable} from '../types'

type Props = {
	children: React.Node,
	redo: string => any,
	removeCourse: Function,
	student: Undoable<HydratedStudentType>,
	undo: string => any,
}

const StudentButtonsToolbar = styled(Toolbar)`
	margin-bottom: 0.5em;
	flex-shrink: 0;
`

const SidebarElement = styled.aside`
	flex: 1;
`

function Sidebar(props: Props) {
	const {undo, redo} = props

	let student = props.student.present
	let studentId = student.id
	let canUndo = props.student.past.length > 0
	let canRedo = props.student.future.length > 0

	return (
		<SidebarElement>
			<StudentButtonsToolbar>
				<ToolbarButton as={Link} to="/" title="Students">
					<Icon block large>
						{iosPeopleOutline}
					</Icon>
				</ToolbarButton>
				<ToolbarButton as={Link} to="./search" title="Search">
					<Icon block large>
						{iosSearch}
					</Icon>
				</ToolbarButton>

				<Separator type="spacer" />

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

				<ToolbarButton as={Link} to="?share" title="Share">
					<Icon block large>
						{iosUploadOutline}
					</Icon>
				</ToolbarButton>
			</StudentButtonsToolbar>

			<CourseRemovalBox
				removeCourse={(scheduleId, clbid) =>
					props.removeCourse(studentId, scheduleId, clbid)
				}
			/>

			{props.children}
		</SidebarElement>
	)
}

const mapDispatch = dispatch =>
	bindActionCreators({undo, redo, removeCourse}, dispatch)

// $FlowFixMe
export default connect(
	undefined,
	mapDispatch,
)(Sidebar)

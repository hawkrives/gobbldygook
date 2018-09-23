// @flow

import * as React from 'react'
import Link from 'react-router/lib/Link'
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
import * as theme from '../theme'
import styled from 'styled-components'
import type {HydratedStudentType} from '@gob/object-student'

type Prop = {
	children: React.Node,
	redo: string => any,
	removeCourse: Function,
	student: {
		data: {
			past: Array<HydratedStudentType>,
			present: HydratedStudentType,
			future: Array<HydratedStudentType>,
		},
	},
	undo: string => any,
}

const StudentButtonsToolbar = styled(Toolbar)`
	margin-bottom: 0.5em;

	flex-shrink: 0;
`

const SidebarElement = styled.aside`
	${theme.contentBlockSpacing};
	flex: 1;

	display: flex;
	flex-direction: column;

	@media all and (min-width: 35em) {
		max-width: 280px;
		padding-left: ${theme.pageEdgePadding};
		padding-right: calc(${theme.pageEdgePadding} * (2 / 3));
	}
`

function Sidebar(props: Prop) {
	const {undo, redo} = props
	const studentId = props.student.data.present.id
	const canUndo = props.student.data.past.length > 0
	const canRedo = props.student.data.future.length > 0

	return (
		<SidebarElement>
			<StudentButtonsToolbar>
				<ToolbarButton as={Link} to="/" title="Students">
					<Icon block large>{iosPeopleOutline}</Icon>
				</ToolbarButton>
				<ToolbarButton as={Link} to={`/s/${studentId}/search`} title="Search">
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

				<ToolbarButton as={Link} to={`/s/${studentId}/share`} title="Share">
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

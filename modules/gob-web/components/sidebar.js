// @flow
import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {BlockIcon} from './icon'
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

type StudentType = Object
type PropTypes = {
	children: React.Node,
	redo: string => any,
	removeCourse: Function,
	student: {
		data: {
			past: StudentType[],
			present: StudentType,
			future: StudentType[],
		},
	},
	undo: string => any,
}

const StudentButtonsToolbar = styled(Toolbar)`
	margin-bottom: 0.5em;
`

const SidebarElement = styled('aside')`
	${theme.contentBlockSpacing};
	flex: 1;

	@media all and (min-width: 35em) {
		max-width: 280px;
		padding-left: ${theme.pageEdgePadding};
		padding-right: calc(${theme.pageEdgePadding} * (2 / 3));
	}
`

function Sidebar(props: PropTypes) {
	const {undo, redo} = props
	const studentId = props.student.data.present.id
	const canUndo = props.student.data.past.length > 0
	const canRedo = props.student.data.future.length > 0

	return (
		<SidebarElement>
			<StudentButtonsToolbar>
				<ToolbarButton to="/" title="Students">
					<BlockIcon>{iosPeopleOutline}</BlockIcon>
				</ToolbarButton>
				<ToolbarButton to={`/s/${studentId}/search`} title="Search">
					<BlockIcon>{iosSearch}</BlockIcon>
				</ToolbarButton>

				<Separator type="spacer" />

				<ToolbarButton
					title="Undo"
					onClick={() => undo(studentId)}
					disabled={!canUndo}
				>
					<BlockIcon>{!canUndo ? iosUndoOutline : iosUndo}</BlockIcon>
				</ToolbarButton>
				<ToolbarButton
					title="Redo"
					onClick={() => redo(studentId)}
					disabled={!canRedo}
				>
					<BlockIcon>{!canRedo ? iosRedoOutline : iosRedo}</BlockIcon>
				</ToolbarButton>

				<Separator type="spacer" />

				<ToolbarButton to={`/s/${studentId}/share`} title="Share">
					<BlockIcon>{iosUploadOutline}</BlockIcon>
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

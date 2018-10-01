// @flow
import * as React from 'react'
import {DropTarget} from 'react-dnd'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled, {css} from 'styled-components'
import * as theme from '../theme'
import {IDENT_COURSE} from '@gob/object-student'
import {Icon} from './icon'
import {iosTrashOutline} from '../icons/ionicons'
import {removeCourse} from '../redux/students/actions/courses'

const Box: any = styled.div`
	padding: 5em 1em;
	color: ${theme.gray500};
	background-color: white;
	border-radius: 5px;

	position: fixed;
	top: calc(${theme.pageEdgePadding} * 2);
	left: calc(${theme.pageEdgePadding} * 2);
	max-width: 240px;

	display: none;
	box-shadow: 0 0 10px #444;

	${props =>
		props.canDrop &&
		css`
			color: black;
			display: flex;
			z-index: ${theme.zSidebar + 1};
		`};

	${props =>
		props.isOver &&
		css`
			box-shadow: 0 0 10px ${theme.red900};
			color: ${theme.red900};
			background-color: ${theme.red50};
		`};
`

type Props = {
	canDrop: boolean, // react-dnd
	connectDropTarget: (React.Element<*>) => any, // react-dnd
	isOver: boolean, // react-dnd
	studentId: string,
	removeCourse: (string, string, number) => any, // redux
}

function CourseRemovalBox(props: Props) {
	return (
		<Box
			ref={(ref: any) => props.connectDropTarget(ref)}
			isOver={props.isOver}
			canDrop={props.canDrop}
		>
			<Icon block style={{fontSize: '3em', textAlign: 'center'}}>
				{iosTrashOutline}
			</Icon>
			Drop a course here to remove it.
		</Box>
	)
}

// Implements the drag source contract.
const removeCourseTarget = {
	drop(props: Props, monitor: any) {
		const item = monitor.getItem()
		const {clbid, fromScheduleId, isFromSchedule} = item
		if (isFromSchedule) {
			// the studentId is embedded in the passed function
			props.removeCourse(props.studentId, fromScheduleId, clbid)
		}
	},
	canDrop(props, monitor: any) {
		const {isFromSearch} = monitor.getItem()
		if (!isFromSearch) {
			return true
		}
		return false
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}
}

const mapDispatch = dispatch => bindActionCreators({removeCourse}, dispatch)

// $FlowFixMe
export default connect(
	undefined,
	mapDispatch,
)(DropTarget(IDENT_COURSE, removeCourseTarget, collect)(CourseRemovalBox))

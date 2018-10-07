// @flow

import * as React from 'react'
import {DropTarget} from 'react-dnd'
import {connect} from 'react-redux'
import styled, {css} from 'styled-components'
import {IDENT_COURSE, Student} from '@gob/object-student'
import {Icon} from './icon'
import {iosTrashOutline} from '../icons/ionicons'
import {
	action as changeStudent,
	type ActionCreator as ChangeStudentFunc,
} from '../redux/students/actions/change'

const Box = styled.div`
	padding: 5em 1em;
	color: var(--gray-500);
	background-color: white;
	border-radius: 5px;

	position: fixed;
	top: calc(var(--page-edge-padding) * 2);
	left: calc(var(--page-edge-padding) * 2);
	max-width: 240px;

	display: none;
	box-shadow: 0 0 10px #444;

	${props =>
		props.canDrop &&
		css`
			color: black;
			display: flex;
			z-index: calc(var(--z-sidebar) + 1);
		`};

	${props =>
		props.isOver &&
		css`
			box-shadow: 0 0 10px var(--red-900);
			color: var(--red-900);
			background-color: var(--red-50);
		`};
`

type Props = {
	canDrop: boolean, // react-dnd
	connectDropTarget: (React.Element<*>) => any, // react-dnd
	isOver: boolean, // react-dnd
	changeStudent: ChangeStudentFunc,
	student: Student,
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

		if (!isFromSchedule) {
			return
		}

		let s = props.student.removeCourseFromSchedule(fromScheduleId, clbid)
		props.changeStudent(s)
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

const droppable = DropTarget(IDENT_COURSE, removeCourseTarget, collect)(
	CourseRemovalBox,
)

const connected = connect(
	undefined,
	{changeStudent},
)(droppable)

export default connected

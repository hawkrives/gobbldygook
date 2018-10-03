// @flow
import * as React from 'react'
import {DropTarget} from 'react-dnd'
import {connect} from 'react-redux'
import styled, {css} from 'styled-components'
import {IDENT_COURSE} from '@gob/object-student'
import {Icon} from './icon'
import {iosTrashOutline} from '../icons/ionicons'
import {removeCourse} from '../redux/students/actions/courses'

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

export default connect(
	undefined,
	{removeCourse},
)(DropTarget(IDENT_COURSE, removeCourseTarget, collect)(CourseRemovalBox))

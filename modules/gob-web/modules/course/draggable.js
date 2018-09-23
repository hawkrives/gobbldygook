import React from 'react'
import {findDOMNode} from 'react-dom'
import styled from 'styled-components'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import {IDENT_COURSE} from '@gob/object-student'
import CourseWithModal from './with-modal'

type Props = {
	className?: string,
	style?: any,
	connectDragSource: () => any, // react-dnd
	isDragging: boolean, // react-dnd
}

const Draggable = styled(CourseWithModal)`
	&:hover {
		cursor: pointer;
	}
`

class DraggableCourse extends React.PureComponent<Props> {
	render() {
		const classSet = cx(this.props.className, {
			'is-dragging': this.props.isDragging,
		})

		return (
			<Draggable
				ref={ref => {
					this.props.connectDragSource(findDOMNode(ref))
				}}
				style={this.props.style}
				className={classSet}
				{...this.props}
			/>
		)
	}
}

// Implements the drag source contract.
const courseSource = {
	beginDrag(props) {
		let scheduleId = props.scheduleId || null
		return {
			isFromSchedule: scheduleId !== null,
			isFromSearch: scheduleId === null,
			clbid: props.course.clbid,
			groupid: props.course.groupid,
			fromScheduleId: scheduleId,
		}
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}
}

export default DragSource(IDENT_COURSE, courseSource, collect)(DraggableCourse)

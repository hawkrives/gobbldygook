import React from 'react'
import styled from 'styled-components'
import { DragSource } from 'react-dnd'
import cx from 'classnames'
import { IDENT_COURSE } from '../../../object-student/item-types'
import CourseWithModal from './with-modal'

type PropTypes = {
    className?: string,
    connectDragSource: () => any, // react-dnd
    isDragging: boolean, // react-dnd
};

const Draggable = styled(CourseWithModal)`
    &:hover {
        cursor: pointer;
    }
`

class DraggableCourse extends React.PureComponent {
    props: PropTypes;

    render() {
        const classSet = cx(this.props.className, {
            'is-dragging': this.props.isDragging,
        })

        return this.props.connectDragSource(
            <div>
                <Draggable className={classSet} {...this.props} />
            </div>
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

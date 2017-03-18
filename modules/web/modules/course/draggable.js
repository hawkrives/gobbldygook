import React from 'react'
import { DragSource } from 'react-dnd'
import cx from 'classnames'
import { IDENT_COURSE } from '../../../object-student/item-types'
import CourseWithModal from './with-modal'

type PropTypes = {
    className?: string,
    connectDragSource: () => any, // react-dnd
    isDragging: boolean, // react-dnd
};

class DraggableCourse extends React.PureComponent {
    props: PropTypes;

    render() {
        const classSet = cx(this.props.className, {
            'is-dragging': this.props.isDragging,
        })

        return this.props.connectDragSource(
            <CourseWithModal
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

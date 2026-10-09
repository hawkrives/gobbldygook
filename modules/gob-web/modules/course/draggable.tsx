import * as React from "react"
import { findDOMNode } from "react-dom"
import styled from "styled-components"
import { DragSource } from "react-dnd"
import type {
  ConnectDragSource,
  DragSourceConnector,
  DragSourceMonitor,
} from "react-dnd"
import cx from "classnames"
import { IDENT_COURSE } from "@gob/object-student"
import CourseWithModal from "./with-modal"
import type { Props as CourseProps } from "./with-modal"

type OwnProps = CourseProps

type CollectedProps = {
  connectDragSource: ConnectDragSource
  isDragging: boolean
}

// What a dragged course carries, for the drop targets
export type DraggedCourse = {
  isFromSchedule: boolean
  isFromSearch: boolean
  clbid: string
  groupid: string
  fromScheduleId: string | null
}

const Draggable = styled(CourseWithModal)`
  &:hover {
    cursor: pointer;
  }
`

class DraggableCourse extends React.PureComponent<OwnProps & CollectedProps> {
  override render() {
    const classSet = cx(this.props.className, {
      "is-dragging": this.props.isDragging,
    })

    return (
      <Draggable
        ref={(ref: CourseWithModal | null) => {
          // oxlint-disable-next-line react/no-find-dom-node, typescript/no-deprecated -- a ref would need CourseWithModal and CompactCourse to forward one, which changes when they re-render
          this.props.connectDragSource(findDOMNode(ref) as Element | null)
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
  beginDrag(props: OwnProps): DraggedCourse {
    // oxlint-disable-next-line typescript/prefer-nullish-coalescing -- an empty scheduleId counts as no schedule
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
function collect(
  connect: DragSourceConnector,
  monitor: DragSourceMonitor,
): CollectedProps {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

export default DragSource<OwnProps, CollectedProps, DraggedCourse>(
  IDENT_COURSE,
  courseSource,
  collect,
)(DraggableCourse)

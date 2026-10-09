import { DropTarget } from "react-dnd"
import type {
  ConnectDropTarget,
  DropTargetMonitor,
  DropTargetConnector,
} from "react-dnd"
import { connect } from "react-redux"
import styled, { css } from "styled-components"
import { IDENT_COURSE } from "@gob/object-student"
import type { Student } from "@gob/object-student"
import { Icon } from "./icon"
import { iosTrashOutline } from "../icons/ionicons"
import { action as changeStudent } from "../redux/students/actions/change"
import type { ActionCreator as ChangeStudentFunc } from "../redux/students/actions/change"
import type { DraggedCourse } from "../modules/course/draggable"

const Box = styled.div<{ canDrop: boolean; isOver: boolean }>`
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

  ${(props) =>
    props.canDrop &&
    css`
      color: black;
      display: flex;
      z-index: calc(var(--z-sidebar) + 1);
    `};

  ${(props) =>
    props.isOver &&
    css`
      box-shadow: 0 0 10px var(--red-900);
      color: var(--red-900);
      background-color: var(--red-50);
    `};
`

type OwnProps = Readonly<{
  changeStudent: ChangeStudentFunc
  student: Student
}>

type CollectedProps = Readonly<{
  canDrop: boolean
  connectDropTarget: ConnectDropTarget
  isOver: boolean
}>

function CourseRemovalBox(props: OwnProps & CollectedProps) {
  return (
    <Box
      ref={(ref) => props.connectDropTarget(ref)}
      isOver={props.isOver}
      canDrop={props.canDrop}
    >
      <Icon block style={{ fontSize: "3em", textAlign: "center" }}>
        {iosTrashOutline}
      </Icon>
      Drop a course here to remove it.
    </Box>
  )
}

// Implements the drag source contract.
const removeCourseTarget = {
  drop(props: OwnProps, monitor: DropTargetMonitor) {
    const item = monitor.getItem() as DraggedCourse
    const { clbid, fromScheduleId, isFromSchedule } = item

    if (!isFromSchedule || fromScheduleId == null) {
      return
    }

    let s = props.student.removeCourseFromSchedule(fromScheduleId, clbid)
    props.changeStudent(s)
  },
  canDrop(_props: OwnProps, monitor: DropTargetMonitor) {
    const { isFromSearch } = monitor.getItem() as DraggedCourse
    if (!isFromSearch) {
      return true
    }
    return false
  },
}

// Specifies the props to inject into your component.
function collect(
  connect: DropTargetConnector,
  monitor: DropTargetMonitor,
): CollectedProps {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
}

const droppable = DropTarget<OwnProps, CollectedProps>(
  IDENT_COURSE,
  removeCourseTarget,
  collect,
)(CourseRemovalBox)

const connected = connect(undefined, { changeStudent })(droppable)

export default connected

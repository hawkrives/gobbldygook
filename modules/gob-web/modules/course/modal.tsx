import * as React from "react"
import styled from "styled-components"
import Modal from "../../components/modal.tsx"
import Separator from "../../components/separator.tsx"
import { Toolbar } from "../../components/toolbar.ts"
import { FlatButton, RaisedButton } from "../../components/button.ts"
import { SemesterSelector } from "./semester-selector.tsx"
import ExpandedCourse from "./expanded.tsx"
import * as theme from "../../theme/index.ts"
import type { Course as CourseType } from "@gob/types"
import type { List } from "immutable"
import type { WarningType } from "@gob/object-student"
import { connect } from "react-redux"
import type { ConnectedProps } from "react-redux"
import type { RootState } from "../../redux/reducer.ts"
import { changeStudent } from "../../redux/students/actions/change.ts"

const ContainerModal = styled(Modal)`
  ${theme.baseCard};
  display: flex;
  flex-flow: column;
  max-width: 45em;

  p,
  ul,
  ol {
    margin: 0;
  }
`

const BottomToolbar = styled.div`
  padding: 10px 20px;
  border-top: 1px solid rgba(160, 160, 160, 0.2);
  margin-top: 0.5em;
  padding-top: 0.5em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`

const RemoveCourseButton = styled(FlatButton)`
  color: var(--red-500);
  padding-left: 0.5em;
  padding-right: 0.5em;
  font-size: 0.85em;
  &:hover {
    background-color: var(--red-50);
    border-color: var(--red-500);
  }
`

const Course = styled(ExpandedCourse)`
  padding: 0 20px;
`

type OwnProps = Readonly<{
  course: CourseType
  conflicts?: List<WarningType> | null | undefined
  onClose: () => unknown
  scheduleId?: string | undefined
  studentId?: string | undefined
}>

const connector = connect(
  (state: RootState, ownProps: OwnProps) => {
    let found =
      ownProps.studentId != null
        ? state.students[ownProps.studentId]
        : undefined
    return { student: found?.present }
  },
  { changeStudent },
)

type Props = OwnProps & Readonly<ConnectedProps<typeof connector>>

class ModalCourse extends React.Component<Props> {
  remove = () => {
    let { student, course, scheduleId } = this.props
    if (!student || scheduleId == null || scheduleId === "") {
      return
    }
    let s = student.removeCourseFromSchedule(scheduleId, course.clbid)
    this.props.changeStudent(s)
  }

  override render() {
    let { course, student, scheduleId, onClose, conflicts } = this.props

    return (
      <ContainerModal onClose={onClose} contentLabel="Course">
        <Toolbar>
          <Separator type="flex-spacer" flex={3} />
          <RaisedButton onClick={onClose}>Close</RaisedButton>
        </Toolbar>

        <Course conflicts={conflicts} course={course} />

        <BottomToolbar>
          {scheduleId != null && scheduleId !== "" && student ? (
            <SemesterSelector
              scheduleId={scheduleId}
              student={student}
              clbid={course.clbid}
            />
          ) : null}
          {scheduleId != null && scheduleId !== "" && student ? (
            <RemoveCourseButton onClick={this.remove}>
              Remove Course
            </RemoveCourseButton>
          ) : null}
        </BottomToolbar>
      </ContainerModal>
    )
  }
}

const connected = connector(ModalCourse)

export { connected as ModalCourse }

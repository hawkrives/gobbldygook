import * as React from "react"
import { Helmet } from "react-helmet-async"
import { connect, type ConnectedProps } from "react-redux"
import { loadStudent } from "../../redux/students/actions/load-student"
import type { RootState } from "../../redux/reducer"
import { Student as StudentObject } from "@gob/object-student"
import type { Undoable } from "../../types"
import styled from "styled-components"
import { Card } from "../../components/card"

const Container = styled.div`
  display: grid;
  justify-content: space-between;
  // grid-gap: calc(var(--page-edge-padding) * (2 / 3));
  grid-gap: var(--page-edge-padding);
  padding-left: var(--page-edge-padding);
  padding-right: var(--page-edge-padding);

  @media all and (min-width: 900px) {
    grid-template-columns: 280px minmax(0, 1fr) 280px;
  }
`

const CouldNotLoadCard = styled(Card)`
  margin: 40px auto;

  max-width: 40em;
  width: 100%;

  padding: 20px;

  text-align: center;
`

type OwnProps = {
  children: (args: { student: Undoable<StudentObject> }) => React.ReactNode // from react-router
  studentId?: string // react-router
}

const connector = connect(
  (state: RootState, ownProps: OwnProps) =>
    ownProps.studentId != null && ownProps.studentId !== ""
      ? { student: state.students[ownProps.studentId] }
      : { student: undefined },
  { loadStudent },
)

type Props = OwnProps & ConnectedProps<typeof connector>

type State = {}

export class Student extends React.Component<Props, State> {
  override componentDidMount() {
    if (
      this.props.studentId != null &&
      this.props.studentId !== "" &&
      !this.props.student
    ) {
      this.props.loadStudent(this.props.studentId)
    }
  }

  override render() {
    if (!this.props.student) {
      return (
        <CouldNotLoadCard>
          <h1>Could not load student</h1>
          <p>Student {this.props.studentId} could not be loaded.</p>
        </CouldNotLoadCard>
      )
    }

    let { student } = this.props

    let title: string = `${student.present.name} | Gobbldygook`

    return (
      <Container>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {this.props.children({ student })}
      </Container>
    )
  }
}

const connected = connector(Student)

export { connected as default }

import * as React from "react"
import map from "lodash/map"
import { connect, type ConnectedProps } from "react-redux"
import type { RouteComponentProps } from "@reach/router"
import type { Student as StudentObject } from "@gob/object-student"
import type { RootState } from "../redux/reducer"
import type { Undoable } from "../types"
import { undo, redo } from "../redux/students/actions/undo"
import { loadStudents } from "../redux/students/actions/load-students"

function Student({
  undo,
  redo,
  student,
}: {
  undo: () => unknown
  redo: () => unknown
  student: Undoable<StudentObject>
}) {
  const canUndo = student.past.length
  const canRedo = student.future.length
  const present = student.present

  return (
    <div>
      <button
        disabled={!canUndo}
        onClick={undo}
        style={{ color: canUndo ? "#444" : "#888" }}
      >
        Undo
      </button>
      <button
        disabled={!canRedo}
        onClick={redo}
        style={{ color: canRedo ? "#444" : "#888" }}
      >
        Redo
      </button>{" "}
      <code>{present.id}</code> {present.name}
    </div>
  )
}

const connector = connect(
  (state: RootState) => ({ students: state.students }),
  {
    undo,
    redo,
    loadStudents,
  },
)

type Props = RouteComponentProps & {
  className?: string
} & ConnectedProps<typeof connector>

function Degub(props: Props) {
  const students = props.students

  return (
    <ul className={`degub ${props.className || ""}`}>
      {map(students, (s, i) => (
        <li key={i}>
          <Student
            student={s}
            undo={() => props.undo(s.present.id)}
            redo={() => props.redo(s.present.id)}
          />
        </li>
      ))}
    </ul>
  )
}

class DegubContainer extends React.Component<Props> {
  override componentDidMount() {
    this.props.loadStudents()
  }
  override render() {
    return <Degub {...this.props} />
  }
}

export default connector(DegubContainer)

import * as React from "react"
import { connect, type ConnectedProps } from "react-redux"
import { Student, type AreaQuery } from "@gob/object-student"
import { pathToOverride } from "@gob/examine-student"
import { AreaOfStudyProvider } from "./provider"
import { AreaOfStudy } from "./area-of-study"
import { changeStudent } from "../../redux/students/actions/change"

const connector = connect(undefined, { changeStudent })

type Props = Readonly<{
  areaOfStudy: AreaQuery
  student: Student
}> &
  ConnectedProps<typeof connector>

type State = Readonly<{
  isOpen: boolean
}>

class AreaOfStudyConnector extends React.Component<Props, State> {
  override state: State = {
    isOpen: false,
  }

  toggleAreaExpansion = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    this.setState({ isOpen: !this.state.isOpen })
  }

  addOverride = (path: ReadonlyArray<string>, ev: React.MouseEvent) => {
    ev.stopPropagation()
    const codifiedPath = pathToOverride(path)
    let s = this.props.student.setOverride(codifiedPath, true)
    this.props.changeStudent(s)
  }

  removeOverride = (path: ReadonlyArray<string>, ev: React.MouseEvent) => {
    ev.stopPropagation()
    const codifiedPath = pathToOverride(path)
    let s = this.props.student.removeOverride(codifiedPath)
    this.props.changeStudent(s)
  }

  toggleOverride = (path: ReadonlyArray<string>, ev: React.MouseEvent) => {
    ev.stopPropagation()
    const codifiedPath = pathToOverride(path)

    if (this.props.student.hasOverride(codifiedPath)) {
      let s = this.props.student.removeOverride(codifiedPath)
      this.props.changeStudent(s)
    } else {
      let s = this.props.student.setOverride(codifiedPath, true)
      this.props.changeStudent(s)
    }
  }

  override render() {
    let { areaOfStudy, student } = this.props

    return (
      <AreaOfStudyProvider areaOfStudy={areaOfStudy} student={student}>
        {({ error, examining, results }) => {
          return (
            <AreaOfStudy
              areaOfStudy={areaOfStudy}
              error={error}
              examining={examining}
              results={results}
              isOpen={this.state.isOpen}
              onToggleOpen={this.toggleAreaExpansion}
              onAddOverride={this.addOverride}
              onRemoveOverride={this.removeOverride}
              onToggleOverride={this.toggleOverride}
            />
          )
        }}
      </AreaOfStudyProvider>
    )
  }
}

const connected = connector(AreaOfStudyConnector)

export { connected as ConnectedAreaOfStudy }

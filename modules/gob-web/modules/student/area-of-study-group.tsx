import * as React from "react"
import { pluralizeArea } from "@gob/examine-student"
import capitalize from "lodash/capitalize.js"
import { AreaOfStudy } from "../area-of-study/index.ts"
import {
  AreaPicker,
  type Selection,
} from "../../components/area-of-study/picker.tsx"
import { FlatButton } from "../../components/button.ts"
import { List } from "immutable"
import { connect, type ConnectedProps } from "react-redux"
import type { ActionMeta } from "react-select/lib/types.js"
import { Student, type AreaQuery } from "@gob/object-student"
import { changeStudent } from "../../redux/students/actions/change.ts"

import "./area-of-study-group.scss"

// react-select 2 also passes the option that was added or removed, which its
// types leave out
type PickerAction = Readonly<
  ActionMeta & {
    option?: Selection
    removedValue?: Selection
  }
>

const connector = connect(undefined, { changeStudent })

type Props = {
  areas?: List<AreaQuery>
  onEndAddArea: (type: string, ev: React.MouseEvent) => unknown
  onInitiateAddArea: (type: string, ev: React.MouseEvent) => unknown
  showAreaPicker: boolean
  student: Student
  type: string
} & ConnectedProps<typeof connector>

class AreaOfStudyGroup extends React.PureComponent<Props> {
  handleChange = (
    _value: ReadonlyArray<Selection>,
    meta: Readonly<ActionMeta>,
  ) => {
    let action = meta as PickerAction
    if (action.action === "remove-value" && action.removedValue) {
      let { name, type, revision } = action.removedValue
      let area = { name, type, revision }
      let s = this.props.student.removeArea(area)
      this.props.changeStudent(s)
    } else if (action.action === "select-option" && action.option) {
      let { name, type, revision } = action.option
      let area = { name, type, revision }
      let s = this.props.student.addArea(area)
      this.props.changeStudent(s)
    }
  }

  override render() {
    let { showAreaPicker, areas = List<AreaQuery>() } = this.props
    let showOrHidePicker = showAreaPicker
      ? this.props.onEndAddArea
      : this.props.onInitiateAddArea

    return (
      <section className="area-of-study-group">
        <h1 className="area-type-heading">
          {capitalize(pluralizeArea(this.props.type))}
          <FlatButton
            className="add-area-of-study"
            onClick={(ev) => showOrHidePicker(this.props.type, ev)}
          >
            {showAreaPicker ? "Close" : "Add ∙ Edit"}
          </FlatButton>
        </h1>

        {showAreaPicker ? (
          <AreaPicker
            type={this.props.type}
            onChange={this.handleChange}
            selections={this.props.student.studies
              .filter((a) => a.type === this.props.type)
              .map((a) => {
                let rev =
                  a.revision != null && a.revision !== ""
                    ? ` (${a.revision})`
                    : ""
                return {
                  label: a.name,
                  value: `${a.name}${rev}`,
                  ...a,
                }
              })
              .toArray()}
            availableThrough={this.props.student.graduation}
          />
        ) : null}

        {areas.map((area) => (
          <AreaOfStudy
            areaOfStudy={area}
            key={`${area.name}${String(area.revision)}`}
            student={this.props.student}
          />
        ))}
      </section>
    )
  }
}

const connected = connector(AreaOfStudyGroup)

export { connected as AreaOfStudyGroup }

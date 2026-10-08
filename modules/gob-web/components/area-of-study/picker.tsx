import * as React from "react"
import Select from "react-select"
import type { ActionMeta, ValueType } from "react-select/lib/types"
import uniqueId from "lodash/uniqueId"
import { AreaOfStudyProvider } from "./provider"
import type { HansonFile } from "@gob/hanson-format"
import { filterAreaList } from "@gob/object-student"

export type Selection = {
  name: string
  type: string
  revision?: string | undefined
  label: string
  value: string
}

type Props = {
  selections: Array<Selection>
  type: string
  label?: string
  // react-select also passes along the option that was added or removed
  onChange: (selections: Array<Selection>, action: ActionMeta) => unknown
  availableThrough?: number
}

export function getOptions(
  areas: ReadonlyArray<HansonFile>,
  type: string,
  availableThrough?: number,
): Array<Selection> {
  let ofType = areas.filter((a) => a.type === type)

  let filtered = ofType
  if (availableThrough != null) {
    filtered = filterAreaList(ofType, availableThrough)
  }

  return filtered.map(({ name = "", revision }) => ({
    name,
    type,
    revision,
    value: `${name} (${String(revision)})`,
    label: `${name}`,
  }))
}

function isList(
  value: Selection | ReadonlyArray<Selection>,
): value is ReadonlyArray<Selection> {
  return Array.isArray(value)
}

export class AreaPicker extends React.PureComponent<Props> {
  id = uniqueId()

  handleChange = (value: ValueType<Selection>, action: ActionMeta) => {
    // a multi-select clears to null when the last selection is removed
    let selections = value == null ? [] : isList(value) ? [...value] : [value]
    this.props.onChange(selections, action)
  }

  override render() {
    let { selections, type, label, availableThrough } = this.props
    let id = `area-picker-${this.id}`

    return (
      <AreaOfStudyProvider>
        {({ areas, loading }) => {
          let options = getOptions(areas, type, availableThrough)

          return (
            <>
              {label && <label htmlFor={id}>{label}</label>}
              <Select<Selection>
                className="react-select"
                isClearable={false}
                isMulti={true}
                isLoading={loading}
                name={id}
                options={options}
                onChange={this.handleChange}
                value={selections}
              />
            </>
          )
        }}
      </AreaOfStudyProvider>
    )
  }
}

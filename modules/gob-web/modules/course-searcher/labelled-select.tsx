import type * as React from "react"

import uniqueId from "lodash/uniqueId"

export function LabelledSelect(props: {
  onChange: (ev: React.ChangeEvent<HTMLSelectElement>) => unknown
  value: string
  label: string
  options: ReadonlyArray<readonly [string, string]>
}) {
  let { onChange, value, label, options } = props
  let id = `labelled-select-${uniqueId()}`

  return (
    <>
      <label htmlFor={id}>{label}</label>

      <select id={id} value={value} onChange={onChange}>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  )
}

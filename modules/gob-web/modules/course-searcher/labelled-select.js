// @flow
import React from 'react'

import uniqueId from 'lodash/uniqueId'

export function LabelledSelect(props: {
	onChange: (ev: SyntheticEvent<HTMLSelectElement>) => mixed,
	value: string,
	label: string,
	options: Array<[string, string]>,
}) {
	let {onChange, value, label, options} = props
	let id = `labelled-select-${uniqueId()}`

	return (
		<React.Fragment>
			<label htmlFor={id}>{label}</label>

			<select id={id} value={value} onChange={onChange}>
				{options.map(([value, label]) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</select>
		</React.Fragment>
	)
}

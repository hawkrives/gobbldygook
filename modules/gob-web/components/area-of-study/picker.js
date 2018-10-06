// @flow

import React from 'react'
import Select from 'react-select'
import uniqueId from 'lodash/uniqueId'
import type {OptionType} from 'react-select/src/types'
import {AreaOfStudyProvider} from './provider'
import type {ParsedHansonFile} from '@gob/hanson-format'
import {filterAreaList} from '@gob/object-student'

export type Selection = {
	name: string,
	type: string,
	revision?: string,
	label: string,
	value: string,
}

type Props = {
	selections: Array<Selection>,
	type: string,
	label?: string,
	onChange: (Array<Selection>) => any,
	availableThrough?: number,
}

export function getOptions(
	areas: Array<ParsedHansonFile>,
	type: string,
	availableThrough?: number,
): Array<OptionType> {
	areas = areas.filter(a => a.type === type)

	let filtered = areas
	if (availableThrough != null) {
		filtered = filterAreaList(areas, availableThrough)
	}

	return filtered.map(({name, type, revision}) => ({
		name,
		type,
		revision,
		value: `${name} (${revision})`,
		label: `${name}`,
	}))
}

export class AreaPicker extends React.PureComponent<Props> {
	id = uniqueId()

	render() {
		let {selections, type, label, availableThrough} = this.props
		let id = `area-picker-${this.id}`

		return (
			<AreaOfStudyProvider>
				{({areas, loading}) => {
					let options = getOptions(areas, type, availableThrough)

					return (
						<>
							{label && <label htmlFor={id}>{label}</label>}
							<Select
								className="react-select"
								isClearable={false}
								isMulti={true}
								isLoading={loading}
								name={id}
								options={options}
								onChange={this.props.onChange}
								value={selections}
							/>
						</>
					)
				}}
			</AreaOfStudyProvider>
		)
	}
}

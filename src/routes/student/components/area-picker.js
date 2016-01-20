import React, {Component, PropTypes} from 'react'
import fuzzysearch from 'fuzzysearch'
import pluralizeArea from '../../../area-tools/pluralize-area'
import map from 'lodash/collection/map'
import reject from 'lodash/collection/reject'
import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'
import groupBy from 'lodash/collection/groupBy'
import flatten from 'lodash/array/flatten'
import sortBy from 'lodash/collection/sortBy'
import max from 'lodash/collection/max'

import Button from '../../../components/button'
import List from '../../../components/list'
import Toolbar from '../../../components/toolbar'

import './area-picker.scss'

function AreaPicker(props) {
	const graduation = props.studentGraduation

	const currentAreaNames = map(props.currentAreas, a => a.name)
	let onlyAvailableAreas = reject(props.areaList, area => includes(currentAreaNames, area.name))
	onlyAvailableAreas = reject(onlyAvailableAreas, area => area['available through'] && area['available through'] <= graduation)

	const groupedAreas = groupBy(onlyAvailableAreas, area => `{${area.name}, ${area.type}}`)

	onlyAvailableAreas = flatten(map(groupedAreas, areaSet => {
		return areaSet.length >= 2
			? filter(sortBy(areaSet, 'revision'), (area, i, list) => {
				const availableThrough = i < list.length - 1
					? max(map([area, list[i+1]], a => Number(a.revision.split('-')[0]) + 1))
					: Number(area.revision.split('-')[0]) + 1

				return availableThrough <= graduation
			})
			: areaSet
	}))

	const filteredOnName = filter(onlyAvailableAreas, area =>
		fuzzysearch(props.filterText, area.name.toLowerCase()))

	const areaList = map(filteredOnName, (area, i) =>
		<li key={area.name + i} className='area--choice'>
			<span className='area-listing'>
				<span className='title'>{area.name}</span>
				<span className='revision'>{area.revision}</span>
			</span>
			<Button className='toggle-area' type='flat'
				onClick={ev => props.onAddArea(area, ev)}>
				Add
			</Button>
		</li>)

	let message = <li>Oh! We need a new message here!</li>
	if (props.filterText) {
		message = <li>No matching ${pluralizeArea(props.type)}.</li>
	}
	else if (currentAreaNames.size) {
		message = <li>All ${pluralizeArea(props.type)} have been added.</li>
	}
	else {
		message = <li>No {pluralizeArea(props.type)} are available.</li>
	}

	return (
		<div className='add-area'>
			<Toolbar>
				<input
					className='add-area--filter'
					placeholder={`Filter ${pluralizeArea(props.type)}`}
					value={props.filterText}
					onChange={props.onFilterChange}
				/>
			</Toolbar>

			<List type='plain'>
				{areaList.length ? areaList : message}
			</List>
		</div>
	)
}

AreaPicker.propTypes = {
	areaList: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
	filterText: PropTypes.string.isRequired,
	onAddArea: PropTypes.func.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	studentGraduation: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
}

export default class AreaPickerContainer extends Component {
	state = {
		filter: '',
	};

	render() {
		return <AreaPicker {...this.props}
			onFilterChange={ev => this.setState({filter: (ev.target.value || '').toLowerCase()})}
		/>
	}
}

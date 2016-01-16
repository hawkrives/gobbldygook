import React, {Component, PropTypes} from 'react'
import fuzzysearch from 'fuzzysearch'
import pluralizeArea from '../area-tools/pluralize-area'
import map from 'lodash/collection/map'
import reject from 'lodash/collection/reject'
import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'
import groupBy from 'lodash/collection/groupBy'
import flatten from 'lodash/array/flatten'
import sortBy from 'lodash/collection/sortBy'
import max from 'lodash/collection/max'

import Button from './button'
import List from './list'
import Toolbar from './toolbar'

import './area-picker.scss'

export default class AreaPicker extends Component {
	static propTypes = {
		addArea: PropTypes.func.isRequired,
		allAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
		closePicker: PropTypes.func.isRequired,
		currentAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
		removeArea: PropTypes.func.isRequired,
		studentGraduation: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
	};

	constructor() {
		super()
		this.state = {
			filter: '',
		}
	}

	render() {
		const graduation = this.props.studentGraduation

		const currentAreaNames = map(this.props.currentAreas, a => a.name)
		let onlyAvailableAreas = reject(this.props.allAreas, area => includes(currentAreaNames, area.name))
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

		const filteredOnName = filter(onlyAvailableAreas, area => fuzzysearch(this.state.filter, area.name.toLowerCase()))
		const areaList = map(filteredOnName, (area, i) =>
				<li key={area.name + i} className='area--choice'>
					<span className='area-listing'>
						<span className='title'>{area.name}</span>
						<span className='revision'>{area.revision}</span>
					</span>
					<Button className='toggle-area' type='flat'
						onClick={ev => this.props.addArea({ev, area})}>
						Add
					</Button>
				</li>)

		let message = <li>Oh! We need a new message here!</li>
		if (this.state.filter) {
			message = <li>No matching ${pluralizeArea(this.props.type)}.</li>
		}
		else if (currentAreaNames.size) {
			message = <li>All ${pluralizeArea(this.props.type)} have been added.</li>
		}
		else {
			message = <li>No {pluralizeArea(this.props.type)} are available.</li>
		}

		return (
			<div className='add-area'>
				<Toolbar>
					<input
						className='add-area--filter'
						placeholder={`Filter ${pluralizeArea(this.props.type)}`}
						value={this.state.filter}
						onChange={ev => this.setState({filter: (ev.target.value || '').toLowerCase()})}
					/>
					{/*<Button className='close-area-picker' onClick={this.props.closePicker}>Close</Button>*/}
				</Toolbar>

				<List type='plain'>
					{areaList.length ? areaList : message}
				</List>
			</div>
		)
	}
}

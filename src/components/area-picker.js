import React, {Component, PropTypes} from 'react'
import fuzzysearch from 'fuzzysearch'
import pluralizeArea from '../area-tools/pluralize-area'
import map from 'lodash/collection/map'
import reject from 'lodash/collection/reject'
import filter from 'lodash/collection/filter'
import includes from 'lodash/collection/includes'

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
		studentMatriculation: PropTypes.number.isRequired,
		type: PropTypes.string.isRequired,
	}

	constructor() {
		super()
		this.state = {
			filter: '',
		}
	}

	render() {
		const currentAreaNames = map(this.props.currentAreas, a => a.name)

		const onlyAvailableAreas = reject(this.props.allAreas, area => includes(currentAreaNames, area.name))
		// const onlyUnusedAreas = reject(this.props.allAreas, area => includes(currentAreaNames, area.name))
		// const onlyAvailableAreas = reject(onlyUnusedAreas, area => this.props.studentMatriculation && this.props.studentMatriculation > Number(area.revision.split('-')[0]))
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

		let message = 'Oh! We need a new message here!'
		if (this.state.filter) {
			message = `No matching ${pluralizeArea(this.props.type)}.`
		}
		else if (currentAreaNames.size) {
			message = `All ${pluralizeArea(this.props.type)} have been added.`
		}
		else {
			message = `No ${pluralizeArea(this.props.type)} are available.`
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
					<Button className='close-area-picker' onClick={this.props.closePicker}>Close</Button>
				</Toolbar>

				<List type='plain'>
					{areaList.length ? areaList : message}
				</List>
			</div>
		)
	}
}

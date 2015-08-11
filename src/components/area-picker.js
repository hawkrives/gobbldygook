import React, {Component, PropTypes} from 'react'
import I from 'immutable'
import fuzzysearch from 'fuzzysearch'
import pluralizeArea from '../lib/pluralize-area'
import kebabCase from 'lodash/string/kebabCase'

import Button from './button'
import List from './list'
import Toolbar from './toolbar'

import './area-picker.scss'

export default class AreaPicker extends Component {
	static propTypes = {
		addArea: PropTypes.func.isRequired,
		allAreas: PropTypes.instanceOf(I.List).isRequired,
		closePicker: PropTypes.func.isRequired,
		currentAreas: PropTypes.instanceOf(I.List).isRequired,
		removeArea: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
	}

	constructor() {
		super()
		this.state = {
			filter: '',
		}
	}

	render() {
		const currentAreaNames = this.props.currentAreas.map(a => a.name)

		const areaList = this.props.allAreas
			.toList()
			.filterNot(area => currentAreaNames.includes(area.name))
			.filter(area => fuzzysearch(this.state.filter, area.name.toLowerCase()))
			.map((area, i) =>
				<div key={area.name + i} className='area--choice'>
					{area.name}
					<Button className='toggle-area' type='flat'
						onClick={ev => this.props.addArea({ev, area})}>
						Add
					</Button>
				</div>)
			.toArray()

		return (
			<div className='add-area'>
				<Toolbar>
					<input
						className='add-area--filter'
						placeholder={'Filter ' + pluralizeArea(this.props.type)}
						value={this.state.filter}
						onChange={ev => this.setState({filter: (ev.target.value || '').toLowerCase()})} />
					<Button className='close-area-picker' onClick={this.props.closePicker}>Close</Button>
				</Toolbar>

				<List type='plain'>
					{areaList.length
						? areaList
						: currentAreaNames.size
							? 'All available areas have already been added.'
							: 'No areas are available.'}
				</List>
			</div>
		)
	}
}

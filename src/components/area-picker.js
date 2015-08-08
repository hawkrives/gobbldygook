import React, {Component, PropTypes} from 'react'
import I from 'immutable'
import fuzzysearch from 'fuzzysearch'

import Button from './button'
import List from './list'

export default class AreaPicker extends Component {
	static propTypes = {
		addArea: PropTypes.func.isRequired,
		allAreas: PropTypes.instanceOf(I.List).isRequired,
		currentAreas: PropTypes.instanceOf(I.List).isRequired,
		removeArea: PropTypes.func.isRequired,
	}

	constructor() {
		super()
		this.state = {
			filter: '',
		}
	}

	render() {
		const currentAreaNames = this.props.currentAreas.map(a => a.name)

		return (
			<div className='add-area'>
				<input value={this.state.filter} onChange={ev => this.setState({filter: (ev.target.value || '').toLowerCase()})} />

				<List type='plain'>
					{this.props.allAreas
						.toList()
						.filter(a => fuzzysearch(this.state.filter, a.name.toLowerCase()))
						.map((area, i) =>
							<div key={i} className='area--choice'>
								{area.name}
								{
									currentAreaNames.includes(area.name)
									? <Button type='flat' onClick={ev => this.props.removeArea({ev, areaId: area.id})}>
										Remove
									</Button>
									: <Button type='flat' onClick={ev => this.props.addArea({ev, area})}>
										Add
									</Button>
								}
							</div>)
						.toArray()}
				</List>
			</div>
		)
	}
}

import React, {Component, PropTypes} from 'react'
import pluralizeArea from '../lib/pluralize-area'
import capitalize from 'lodash/string/capitalize'

import {List} from 'immutable'

import AreaOfStudy from './area-of-study'
import AreaPicker from './area-picker'
import Button from './button'

export default class AreaOfStudyGroup extends Component {
	static propTypes = {
		addArea: PropTypes.func.isRequired,
		addOverride: PropTypes.func.isRequired,
		allAreas: PropTypes.instanceOf(List).isRequired,
		areas: PropTypes.instanceOf(List).isRequired,
		endAddArea: PropTypes.func.isRequired,
		initiateAddArea: PropTypes.func.isRequired,
		removeArea: PropTypes.func.isRequired,
		showAreaPicker: PropTypes.bool,
		toggleOverride: PropTypes.func.isRequired,
		type: PropTypes.oneOf(['degree', 'major', 'concentration', 'emphasis']).isRequired,
	}

	static defaultProps = {
		showAreaPicker: false,
	}

	render() {
		return (
			<section key={this.props.type} className='area-of-study-group'>
				<h1 className='area-type-heading'>
					{capitalize(pluralizeArea(this.props.type))}
					{
						this.props.showAreaPicker
							? <Button className='add-area-of-study' type='flat' onClick={ev => this.props.endAddArea({ev, type: this.props.type})}>
								Close
							</Button>
							: <Button className='add-area-of-study' type='flat' onClick={ev => this.props.initiateAddArea({ev, type: this.props.type})}>
								Add/Edit
							</Button>
					}
				</h1>

				{this.props.areas.map(area =>
					<AreaOfStudy key={area.id}
						{...area}
						removeArea={this.props.removeArea}
						addOverride={this.props.addOverride}
						toggleOverride={this.props.toggleOverride}
					/>).toArray()}

				{this.props.showAreaPicker
					? <AreaPicker
						currentAreas={this.props.areas}
						closePicker={ev => this.props.endAddArea({ev, type: this.props.type})}
						type={this.props.type}
						allAreas={this.props.allAreas}
						addArea={this.props.addArea}
						removeArea={this.props.removeArea} />
					: null}
			</section>
		)
	}
}

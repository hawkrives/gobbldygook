import React, {Component, PropTypes} from 'react'
import pluralizeArea from '../lib/pluralize-area'
import capitalize from 'lodash/string/capitalize'

import {List as ImmutableList} from 'immutable'

import Button from './button'
import AreaOfStudy from './area-of-study'

export default class AreaOfStudyGroup extends Component {
	static propTypes = {
		areas: PropTypes.instanceOf(ImmutableList).isRequired,
		studentId: PropTypes.string.isRequired,
		type: PropTypes.oneOf(['degree', 'major', 'concentration', 'emphasis']).isRequired,
	}

	render() {
		return (
			<section key={this.props.type} className='area-of-study-group'>
				<h1 className='area-type-heading'>
					{capitalize(pluralizeArea(this.props.type))}
					<Button className='add-area-of-study' type='flat'>
						Add
					</Button>
				</h1>

				{this.props.areas.map(area =>
					<AreaOfStudy key={area.id} {...area} studentId={this.props.studentId} />).toArray()}
			</section>
		)
	}
}

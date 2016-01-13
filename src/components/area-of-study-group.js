import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import pluralizeArea from '../area-tools/pluralize-area'
import capitalize from 'lodash/string/capitalize'
import * as areaTypeConstants from '../models/area-types'
import values from 'lodash/object/values'

import AreaOfStudy from './area-of-study'
import AreaPicker from './area-picker'
import Button from './button'

import './area-of-study-group.scss'

export default class AreaOfStudyGroup extends Component {
	static propTypes = {
		addArea: PropTypes.func.isRequired,
		addOverride: PropTypes.func.isRequired,
		allAreasOfType: PropTypes.arrayOf(PropTypes.object).isRequired,
		areas: PropTypes.arrayOf(PropTypes.object).isRequired,
		endAddArea: PropTypes.func.isRequired,
		initiateAddArea: PropTypes.func.isRequired,
		removeArea: PropTypes.func.isRequired,
		removeOverride: PropTypes.func,
		showAreaPicker: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
		toggleOverride: PropTypes.func.isRequired,
		type: PropTypes.oneOf(values(areaTypeConstants)).isRequired,
	};

	static defaultProps = {
		showAreaPicker: false,
		studentId: '',
		removeOverride: () => {},
	};

	render() {
		return (
			<section key={this.props.type} className='area-of-study-group'>
				<h1 className='area-type-heading'>
					{capitalize(pluralizeArea(this.props.type))}
					{this.props.showAreaPicker
						? <Button
							className='add-area-of-study'
							type='flat'
							onClick={ev => this.props.endAddArea({ev, type: this.props.type})}
						>
							Close
						</Button>
						: <Button
							className='add-area-of-study'
							type='flat'
							onClick={ev => this.props.initiateAddArea({ev, type: this.props.type})}
						>
							Add ∙ Edit
						</Button>}
				</h1>

				{this.props.showAreaPicker && <AreaPicker
					addArea={this.props.addArea}
					allAreas={this.props.allAreasOfType}
					closePicker={ev => this.props.endAddArea({ev, type: this.props.type})}
					currentAreas={this.props.areas}
					removeArea={this.props.removeArea}
					studentGraduation={this.props.student.graduation}
					type={this.props.type}
				/>}

				{map(this.props.areas, (area, i) =>
					<AreaOfStudy area={area}
						key={i}
						removeArea={this.props.removeArea}
						addOverride={this.props.addOverride}
						removeOverride={this.props.removeOverride}
						toggleOverride={this.props.toggleOverride}
						showCloseButton={this.props.showAreaPicker}
						showEditButton={this.props.showAreaPicker}
						studentId={this.props.student.id}
					/>)}
			</section>
		)
	}
}

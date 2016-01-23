import React, {PropTypes} from 'react'
import map from 'lodash/map'
import pluralizeArea from '../../../area-tools/pluralize-area'
import capitalize from 'lodash/capitalize'
import * as areaTypeConstants from '../../../models/area-types'
import values from 'lodash/values'

import AreaOfStudy from './area-of-study'
import AreaPicker from './area-picker'
import Button from '../../../components/button'

import './area-of-study-group.scss'

export default function AreaOfStudyGroup(props) {
	const showAreaPicker = props.showAreaPicker || false
	const showOrHidePicker = showAreaPicker
		? props.onEndAddArea
		: props.onInitiateAddArea

	return (
		<section className='area-of-study-group'>
			<h1 className='area-type-heading'>
				{capitalize(pluralizeArea(props.type))}
				<Button
					className='add-area-of-study'
					type='flat'
					onClick={ev => showOrHidePicker(props.type, ev)}
				>
					{showAreaPicker ? 'Close' : 'Add ∙ Edit'}
				</Button>
			</h1>

			{showAreaPicker ? <AreaPicker
				areaList={props.allAreasOfType}
				currentAreas={props.areas}
				onAddArea={props.onAddArea}
				studentGraduation={props.student.graduation}
				type={props.type}
			/> : null}

			{map(props.areas, (area, i) =>
				<AreaOfStudy area={area}
					key={i + area.name ? area.name : ''}
					onAddOverride={props.onAddOverride}
					onRemoveArea={props.onRemoveArea}
					onRemoveOverride={props.onRemoveOverride}
					onToggleOverride={props.onToggleOverride}
					showCloseButton={showAreaPicker}
					showEditButton={showAreaPicker}
					studentId={props.student.id}
				/>)}
		</section>
	)
}

AreaOfStudyGroup.propTypes = {
	allAreasOfType: PropTypes.arrayOf(PropTypes.object).isRequired,
	areas: PropTypes.arrayOf(PropTypes.object).isRequired,
	onAddArea: PropTypes.func.isRequired,
	onAddOverride: PropTypes.func.isRequired,
	onEndAddArea: PropTypes.func.isRequired,
	onInitiateAddArea: PropTypes.func.isRequired,
	onRemoveArea: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func,
	onToggleOverride: PropTypes.func.isRequired,
	showAreaPicker: PropTypes.bool.isRequired,
	student: PropTypes.object.isRequired,
	type: PropTypes.oneOf(values(areaTypeConstants)).isRequired,
}

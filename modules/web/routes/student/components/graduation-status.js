import React, {PropTypes} from 'react'

import AreaOfStudySidebar from './area-of-study-sidebar'
import StudentSummary from './student-summary'

import './graduation-status.scss'

export default function GraduationStatus(props) {
	if (!props.student) {
		return null
	}

	return (
		<section className="graduation-status">
			<StudentSummary
				onChangeGraduation={props.onChangeGraduation}
				onChangeMatriculation={props.onChangeMatriculation}
				onChangeName={props.onChangeName}
				student={props.student}
			/>
			<AreaOfStudySidebar
				allAreas={props.allAreas}
				showAreaPickerFor={props.showAreaPickerFor}
				onAddArea={props.onAddArea}
				onAddOverride={props.onAddOverride}
				onEndAddArea={props.onEndAddArea}
				onInitiateAddArea={props.onInitiateAddArea}
				onRemoveArea={props.onRemoveArea}
				onRemoveOverride={props.onRemoveOverride}
				onToggleOverride={props.onToggleOverride}
				student={props.student}
			/>
		</section>
	)
}

GraduationStatus.propTypes = {
	allAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
	onAddArea: PropTypes.func.isRequired,
	onAddOverride: PropTypes.func.isRequired,
	onChangeGraduation: PropTypes.func.isRequired,
	onChangeMatriculation: PropTypes.func.isRequired,
	onChangeName: PropTypes.func.isRequired,
	onEndAddArea: PropTypes.func.isRequired,
	onInitiateAddArea: PropTypes.func.isRequired,
	onRemoveArea: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func.isRequired,
	onToggleOverride: PropTypes.func.isRequired,
	showAreaPickerFor: PropTypes.object.isRequired,
	student: PropTypes.object.isRequired,
}

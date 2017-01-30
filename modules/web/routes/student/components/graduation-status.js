import React, { PropTypes } from 'react'

import AreaOfStudySidebar from './area-of-study-sidebar'
import StudentSummary from './student-summary'

import * as colors from 'modules/web/styles/colors'

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
			<style jsx>{`
				.graduation-status {
					font-size: 0.85em;
				}

				:global(.unused-areas-title) {
					margin-right: 0.25em;
					margin-left: 0.25em;
				}

				:global(.unused-areas-of-study) {
					margin-top: 1em;
					display: flex;
					align-items: baseline;
					justify-content: flex-start;
					font-feature-settings: 'smcp';
					font-size: 0.9em;
					color: ${colors.gray_700};
				}

				:global(.unused-areas-buttons) {
					display: flex;
					flex-flow: row wrap;
				}

				:global(.add-unused-area-of-study) {
					text-transform: capitalize;
					display: inline-block;
					text-decoration: underline;
					color: inherit;

					padding: 0.125em 0.25em;
				}
			`}</style>
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

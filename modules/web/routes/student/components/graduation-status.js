// @flow
import React from 'react'

import AreaOfStudySidebar from './area-of-study-sidebar'
import StudentSummary from './student-summary'

import * as colors from 'modules/web/styles/colors'

export default function GraduationStatus(props: {
	allAreas: Object[],
	onAddArea: () => any,
	onAddOverride: () => any,
	onChangeGraduation: (value: string) => any,
	onChangeMatriculation: (value: string) => any,
	onChangeName: (value: string) => any,
	onEndAddArea: () => any,
	onInitiateAddArea: () => any,
	onRemoveArea: () => any,
	onRemoveOverride: () => any,
	onToggleOverride: () => any,
	showAreaPickerFor: Object,
	student: Object,
}) {
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

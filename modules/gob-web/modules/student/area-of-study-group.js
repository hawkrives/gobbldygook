// @flow

import React from 'react'
import {pluralizeArea} from '@gob/examine-student'
import capitalize from 'lodash/capitalize'
import type {AreaOfStudyTypeEnum} from '@gob/examine-student'
import {AreaOfStudy} from '../area-of-study'
import {AreaPicker, type Selection} from '../../components/area-of-study/picker'
import {FlatButton} from '../../components/button'
import type {
	HydratedStudentType,
	AreaOfStudyType,
	AreaQuery,
} from '@gob/object-student'

import './area-of-study-group.scss'

type Props = {
	addArea: (string, AreaQuery) => any,
	areas: Array<AreaOfStudyType>,
	onEndAddArea: (string, Event) => any,
	onInitiateAddArea: (string, Event) => any,
	removeArea: (string, AreaQuery) => any,
	showAreaPicker: boolean,
	student: HydratedStudentType,
	type: AreaOfStudyTypeEnum,
}

export class AreaOfStudyGroup extends React.PureComponent<Props> {
	handleChange = (value: Array<Selection>, action: any) => {
		if (action.action === 'remove-value') {
			let {name, type, revision} = action.removedValue
			let area = {name, type, revision}
			this.props.student.removeAreaOfStudy(area)
		} else if (action.action === 'select-option') {
			let {name, type, revision} = action.option
			let area = {name, type, revision}
			this.props.student.addAreaOfStudy(area)
		}
	}

	render() {
		const props = this.props
		const showAreaPicker = props.showAreaPicker || false
		const showOrHidePicker = showAreaPicker
			? props.onEndAddArea
			: props.onInitiateAddArea

		return (
			<section className="area-of-study-group">
				<h1 className="area-type-heading">
					{capitalize(pluralizeArea(props.type))}
					<FlatButton
						className="add-area-of-study"
						onClick={ev => showOrHidePicker(props.type, ev)}
					>
						{showAreaPicker ? 'Close' : 'Add ∙ Edit'}
					</FlatButton>
				</h1>

				{showAreaPicker ? (
					<AreaPicker
						type={props.type}
						onChange={this.handleChange}
						selections={props.student.studies.map(a => {
							let rev = a.revision ? ` (${a.revision})` : ''
							return {
								label: `${a.name}`,
								value: `${a.name}${rev}`,
								...a,
							}
						})}
						availableThrough={props.student.graduation}
					/>
				) : null}

				{props.student.studies.map((area, i) => (
					<AreaOfStudy
						area={area}
						key={i}
						onRemoveArea={this.onRemoveArea}
						showCloseButton={showAreaPicker}
						showEditButton={showAreaPicker}
						student={props.student}
					/>
				))}
			</section>
		)
	}
}

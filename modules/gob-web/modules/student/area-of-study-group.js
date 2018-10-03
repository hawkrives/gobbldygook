// @flow

import React from 'react'
import {pluralizeArea} from '@gob/examine-student'
import capitalize from 'lodash/capitalize'
import {AreaOfStudy} from '../area-of-study'
import {AreaPicker, type Selection} from '../../components/area-of-study/picker'
import {FlatButton} from '../../components/button'
import {List} from 'immutable'
import {Student, type AreaQuery} from '@gob/object-student'
import {type ParsedHansonFile} from '@gob/hanson-format'

import './area-of-study-group.scss'

type Props = {
	areas?: List<AreaQuery>,
	onEndAddArea: (string, Event) => any,
	onInitiateAddArea: (string, Event) => any,
	showAreaPicker: boolean,
	student: Student,
	type: string,
}

export class AreaOfStudyGroup extends React.PureComponent<Props> {
	handleChange = (value: Array<Selection>, action: any) => {
		if (action.action === 'remove-value') {
			let {name, type, revision} = action.removedValue
			let area = {name, type, revision}
			this.props.student.removeArea(area)
		} else if (action.action === 'select-option') {
			let {name, type, revision} = action.option
			let area = {name, type, revision}
			this.props.student.addArea(area)
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
						selections={props.student.studies
							.map(a => {
								let rev = a.revision ? ` (${a.revision})` : ''
								return {
									label: `${a.name}`,
									value: `${a.name}${rev}`,
									...a,
								}
							})
							.toArray()}
						availableThrough={props.student.graduation}
					/>
				) : null}

				{props.areas
					? props.areas.map(area => (
							<AreaOfStudy
								areaOfStudy={area}
								key={`${area.name}${String(area.revision)}`}
								onRemoveArea={() =>
									this.props.student.removeArea(area)
								}
								showCloseButton={showAreaPicker}
								showEditButton={showAreaPicker}
								student={props.student}
							/>
					  ))
					: null}
			</section>
		)
	}
}

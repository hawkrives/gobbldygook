// @flow

import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {pluralizeArea} from '@gob/examine-student'
import capitalize from 'lodash/capitalize'
import type {AreaOfStudyTypeEnum} from '@gob/examine-student'
import {addArea, removeArea} from '../../redux/students/actions/areas'
import AreaOfStudy from '../area-of-study'
import {AreaPicker, type Selection} from '../../components/area-of-study/picker'
import {FlatButton} from '../../components/button'
import type {HydratedStudentType, AreaOfStudyType} from '@gob/object-student'

import './area-of-study-group.scss'

type Student = HydratedStudentType
type Props = {
	addArea: (string, AreaOfStudyType) => any,
	areas: Array<AreaOfStudyType>,
	onEndAddArea: (string, Event) => any,
	onInitiateAddArea: (string, Event) => any,
	removeArea: (string, Object) => any,
	showAreaPicker: boolean,
	student: Student,
	type: AreaOfStudyTypeEnum,
}

class AreaOfStudyGroup extends React.PureComponent<Props> {
	onAddArea = (area: AreaOfStudy, ev: Event) => {
		ev.preventDefault()
		this.props.addArea(this.props.student.id, area)
	}

	onRemoveArea = (areaQuery: AreaOfStudy, ev: Event) => {
		ev.preventDefault()
		this.props.removeArea(this.props.student.id, areaQuery)
	}

	handleChange = (value: Array<Selection>, action: any) => {
		if (action.action === 'remove-value') {
			let {name, type, revision} = action.removedValue
			let area = {name, type, revision}
			this.props.removeArea(this.props.student.id, area)
		} else if (action.action === 'select-option') {
			let {name, type, revision} = action.option
			let area = {name, type, revision}
			this.props.addArea(this.props.student.id, area)
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
						selections={props.areas.map(a => ({
							label: `${a.name}`,
							value: `${a.name} (${a.revision})`,
							...a,
						}))}
						availableThrough={props.student.graduation}
					/>
				) : null}

				{props.areas.map((area, i) => (
					<AreaOfStudy
						area={area}
						key={i + area.name ? area.name : ''}
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

const mapDispatch = dispatch =>
	bindActionCreators({addArea, removeArea}, dispatch)

// $FlowFixMe
export default connect(
	null,
	mapDispatch,
)(AreaOfStudyGroup)

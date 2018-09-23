// @flow

import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {pluralizeArea} from '@gob/examine-student'
import capitalize from 'lodash/capitalize'
import type {AreaOfStudyTypeEnum} from '@gob/examine-student'
import {addArea, removeArea} from '../../redux/students/actions/areas'
import AreaOfStudy from '../area-of-study'
import AreaPicker from './area-picker'
import {FlatButton} from '../../components/button'
import type {HydratedStudentType, AreaOfStudyType} from '@gob/object-student'

import './area-of-study-group.scss'

type Student = HydratedStudentType
type Props = {
	addArea: (string, AreaOfStudyType) => any,
	allAreasOfType: Array<AreaOfStudyType>,
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
		ev.stopPropagation()
		ev.preventDefault()
		this.props.addArea(this.props.student.id, area)
	}

	onRemoveArea = (areaQuery: any, ev: Event) => {
		ev.stopPropagation()
		ev.preventDefault()
		this.props.removeArea(this.props.student.id, areaQuery)
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
						areaList={props.allAreasOfType}
						currentAreas={props.areas}
						onAddArea={this.onAddArea}
						studentGraduation={props.student.graduation}
						type={props.type}
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

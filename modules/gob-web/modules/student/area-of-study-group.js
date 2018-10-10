// @flow

import React from 'react'
import {pluralizeArea} from '@gob/examine-student'
import capitalize from 'lodash/capitalize'
import {AreaOfStudy} from '../area-of-study'
import {AreaPicker, type Selection} from '../../components/area-of-study/picker'
import {FlatButton} from '../../components/button'
import {List} from 'immutable'
import {connect} from 'react-redux'
import {Student, type AreaQuery} from '@gob/object-student'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'

import './area-of-study-group.scss'

type Props = {
	areas?: List<AreaQuery>,
	onEndAddArea: (string, Event) => any,
	onInitiateAddArea: (string, Event) => any,
	showAreaPicker: boolean,
	student: Student,
	type: string,
	changeStudent: ChangeStudentFunc,
}

class AreaOfStudyGroup extends React.PureComponent<Props> {
	handleChange = (value: Array<Selection>, action: any) => {
		if (action.action === 'remove-value') {
			let {name, type, revision} = action.removedValue
			let area = {name, type, revision}
			let s = this.props.student.removeArea(area)
			this.props.changeStudent(s)
		} else if (action.action === 'select-option') {
			let {name, type, revision} = action.option
			let area = {name, type, revision}
			let s = this.props.student.addArea(area)
			this.props.changeStudent(s)
		}
	}

	render() {
		let {showAreaPicker = false, areas = []} = this.props
		let showOrHidePicker = showAreaPicker
			? this.props.onEndAddArea
			: this.props.onInitiateAddArea

		return (
			<section className="area-of-study-group">
				<h1 className="area-type-heading">
					{capitalize(pluralizeArea(this.props.type))}
					<FlatButton
						className="add-area-of-study"
						onClick={ev => showOrHidePicker(this.props.type, ev)}
					>
						{showAreaPicker ? 'Close' : 'Add ∙ Edit'}
					</FlatButton>
				</h1>

				{showAreaPicker ? (
					<AreaPicker
						type={this.props.type}
						onChange={this.handleChange}
						selections={this.props.student.studies
							.filter(a => a.type === this.props.type)
							.map(a => {
								let rev = a.revision ? ` (${a.revision})` : ''
								return {
									label: `${a.name}`,
									value: `${a.name}${rev}`,
									...a,
								}
							})
							.toArray()}
						availableThrough={this.props.student.graduation}
					/>
				) : null}

				{areas.map(area => (
					<AreaOfStudy
						areaOfStudy={area}
						key={`${area.name}${String(area.revision)}`}
						student={this.props.student}
					/>
				))}
			</section>
		)
	}
}

const connected = connect(
	undefined,
	{changeStudent},
)(AreaOfStudyGroup)

export {connected as AreaOfStudyGroup}

import _ from 'lodash'
import React from 'react'
import {capitalize, pluralize} from 'humanize-plus'
import Immutable from 'immutable'

import AreaOfStudy from './areaOfStudy'
import StudentSummary from './studentSummary'
import RevertToDemoButton from './revertToDemoButton'
import DownloadStudentButton from './downloadStudentButton'
import UndoButton from './undoButton'
import RedoButton from './redoButton'

import checkStudentGraduatability from '../helpers/checkStudentGraduatability'

let GraduationStatus = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	componentWillReceiveProps(nextProps) {
		let graduatabilityPromise = checkStudentGraduatability(nextProps.student)
		graduatabilityPromise.then((graduationStatus) => {
			this.setState({graduatability: graduationStatus.graduatability, areaDetails: graduationStatus.areaDetails})
		})
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	getInitialState() {
		return {
			graduatability: null,
			areaDetails: Immutable.List(),
		}
	},

	getDefaultProps: function() {
		return {
			sections: []
		}
	},

	render() {
		// console.info('graduation-status render', this.props.student)
		if (!this.props.student)
			return null

		let summary = React.createElement(StudentSummary, {student: this.props.student, graduatability: this.state.graduatability})

		let sections = this.state.areaDetails
			.groupBy(area => area.type || 'Unknown')
			.map((areas, areaType) => {
				let pluralType = pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)

				let areaTypeHeading = React.createElement('header', {className: 'area-type-heading'},
					React.createElement('h1', null, capitalize(pluralType)))

				let areaElements = areas.map((area, index) => {
					return React.createElement(AreaOfStudy, {
						key: `${area.id}-${index}`,
						student: this.props.student,
						area: area,
					})
				}).toJS()

				areaElements.push(React.createElement('button',
					{key: 'add-button', className: 'add-area-of-study'},
					`Add ${capitalize(areaType)}`))

				return React.createElement('section',
					{id: pluralType, key: areaType},
					areaTypeHeading,
					areaElements)
			}).toJS()

		let studentButtons = React.createElement('menu', {className: 'button-list student-buttons'},
			// React.createElement('button', {className: 'parse-student', onClick: this.parse}, 'Parse'),
			React.createElement(RevertToDemoButton, {studentId: this.props.student.id}),
			React.createElement(DownloadStudentButton, {student: this.props.student}),
			React.createElement(UndoButton, null),
			React.createElement(RedoButton, null))

		return React.createElement('section', {className: 'graduation-status'},
			studentButtons, summary, sections)
	},
})

export default GraduationStatus

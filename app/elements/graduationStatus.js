import _ from 'lodash'
import React from 'react'
import {Link} from 'react-router'
import {capitalize, pluralize} from 'humanize-plus'
import Immutable from 'immutable'

import AreaOfStudy from '../elements/areaOfStudy'
import StudentSummary from '../elements/studentSummary'

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

		return React.createElement('section', {className: 'graduation-status'},
			summary, sections)
	},
})

export default GraduationStatus

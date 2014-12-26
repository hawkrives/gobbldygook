import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'
import * as Immutable from 'immutable'

import AreaOfStudy from 'elements/areaOfStudy'
import StudentSummary from 'elements/studentSummary'

import checkStudentGraduatability from 'helpers/checkStudentGraduatability'

let GraduationStatus = React.createClass({
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

	render() {
		// console.info('graduation-status render', this.props.student)
		if (!this.props.student)
			return null

		let summary = React.createElement(StudentSummary, {student: this.props.student, graduatability: this.state.graduatability})

		let sections = this.state.areaDetails
			.groupBy(area => area.type)
			.map((areas, areaType) => {
				let pluralType = humanize.pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)
				let areaTypeHeading = React.createElement('header', {className: 'area-type-heading'},
					React.createElement('h1', null, humanize.capitalize(pluralType)),
					React.createElement('button', {
						className: 'add-area-of-study',
						title: `Add ${humanize.capitalize(areaType)}`,
					}))

				return React.createElement('section',
					{id: pluralType, key: areaType},
					areaTypeHeading,
					areas.map((area) => {
						return React.createElement(AreaOfStudy, {
							key: area.id,
							student: this.props.student,
							area: area,
						})
					}).toJS())
			}).toJS()

		let studentButtons = React.createElement('menu', {className: 'student-buttons'},
			// React.createElement('button', {className: 'parse-student', onClick: this.parse}, 'Parse'),
			React.createElement('button', {className: 'demo-student', onClick: this.demo}, 'Demo'),
			React.createElement('button', {className: 'download-student'},
				React.createElement('a',
					{href: this.download(), download: `${this.props.student.name}.gb-student.json`},
					'Download')))

		return React.createElement('section', {className: 'graduation-status'},
			studentButtons, summary, sections)
	},

	parse() {
		console.log('parse student')
	},
	demo() {
		console.log('load demo data')
		// revertStudentToDemo()
	},
	download() {
		// console.log('start student download')
		return 'data:text/json;charset=utf-8,' + this.props.student.encode();
	},
})

export default GraduationStatus

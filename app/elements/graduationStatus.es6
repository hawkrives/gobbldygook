import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import AreaOfStudy from 'elements/areaOfStudy'
import StudentSummary from 'elements/studentSummary'

let GraduationStatus = React.createClass({
	parse() {
		console.log('parse student')
	},
	demo() {
		console.log('load demo data')
		// revertStudentToDemo()
	},
	download() {
		console.log('start student download')
		return 'data:text/json;charset=utf-8,' + this.props.student.encode();
	},

	render() {
		// console.info('graduation-status render', this.props.student)
		if (!this.props.student)
			return null

		// Get areas of study
		let areasOfStudy = this.props.student.areasByType.map((areas) => {
			return areas.map((area) => {
				return React.createElement(AreaOfStudy, {
					key: area.id,
					student: this.props.student,
					area: area,
				})
			})
		})

		console.log(areasOfStudy)

		let areaOfStudySections = areasOfStudy.keySeq().map((areaType) => {
			let pluralType = humanize.pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)
			return React.createElement('section', {id: pluralType, key: areaType},
				React.createElement('header', {className: 'area-type-heading'},
					React.createElement('h1', null, humanize.capitalize(pluralType)),
					React.createElement('button', {
						className: 'add-area-of-study',
						title: `Add ${humanize.capitalize(areaType)}`,
					})
				),
				areasOfStudy.get(areaType)
			)
		})

		let studentButtons = React.createElement('menu', {className: 'student-buttons'},
			// React.createElement('button', {className: 'parse-student', onClick: this.parse}, 'Parse'),
			React.createElement('button', {className: 'demo-student', onClick: this.demo}, 'Demo'),
			React.createElement('button', {className: 'download-student'},
				React.createElement('a',
					{
						href: this.download(),
						download: `${this.props.student.name}.gb-student.json`,
					},
					'Download')))

		return React.createElement('section', {className: 'graduation-status'},
			studentButtons,
			React.createElement(StudentSummary, {student: this.props.student}),
			areaOfStudySections
		)
	},
})

export default GraduationStatus

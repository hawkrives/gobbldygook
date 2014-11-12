'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'
import emitter from '../helpers/emitter.es6'

import AreaOfStudy from './areaOfStudy.es6'
import StudentSummary from './studentSummary.es6'

var GraduationStatus = React.createClass({
	displayName: 'GraduationStatus',

	parse() {
		console.log('parse student')
	},
	demo() {
		console.log('load demo data')
		emitter.emit('revertStudentToDemo')
	},
	download() {
		console.log('start student download')
		return 'data:text/json;charset=utf-8,' + this.props.student.encode();
	},

	render() {
		// console.info('graduation-status render', this.props.student)

		// Get areas of study
		var areasOfStudy = _.mapValues(this.props.student.studies.byType, (areas) => {
			return _.map(areas, (area) => {
				return React.createElement(AreaOfStudy, {
					key: area.id,
					student: this.props.student,
					area: area
				})
			})
		})

		var areaOfStudySections = _.map(_.keys(areasOfStudy), (areaType) => {
			var pluralType = humanize.pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)
			return React.createElement('section', {id: pluralType, key: areaType},
				React.createElement('header', {className: 'area-type-heading'},
					React.createElement('h1', null, humanize.capitalize(pluralType)),
					React.createElement('button', {
						className: 'add-area-of-study',
						title: 'Add ' + humanize.capitalize(areaType)
					})
				),
				areasOfStudy[areaType]
			)
		})

		var studentButtons = React.createElement('menu', {className: 'student-buttons'},
			// React.createElement('button', {className: 'demo-student', onClick: this.parse}, 'Parse'),
			React.createElement('button', {className: 'demo-student', onClick: this.demo}, 'Demo'),
			React.createElement('button', {className: 'download-student'},
				React.createElement('a', {href: this.download(), download: this.props.student.name + '.gb-student.json'}, 'Download')))

		return React.createElement('section', {className: 'graduation-status'},
			studentButtons,
			React.createElement(StudentSummary, {student: this.props.student}),
			areaOfStudySections
		)
	}
});

export default GraduationStatus

'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'
import emitter from '../helpers/emitter'

import AreaOfStudy from './areaOfStudy'
import StudentSummary from './studentSummary'

var GraduationStatus = React.createClass({
	displayName: 'GraduationStatus',

	save() {
		console.log('save student')
		emitter.emit('save')
	},
	load() {
		console.log('load student')
	},
	parse() {
		console.log('load student')
	},
	demo() {
		console.log('load demo data')
	},

	render() {
		// console.info('graduation-status render', this.props.student)

		// Get areas of study
		var areasOfStudy = _.mapValues(this.props.student.studies.byType, function(areas) {
			return _.map(areas, function(area) {
				return React.createElement(AreaOfStudy, {
					key: area.id,
					student: this.props.student,
					area: area
				})
			}, this)
		}, this)

		var areaOfStudySections = _.map(_.keys(areasOfStudy), function(areaType) {
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
			React.createElement('button', {className: 'load-student', onClick: this.load}, 'Load'),
			React.createElement('button', {className: 'demo-student', onClick: this.parse}, 'Parse'),
			React.createElement('button', {className: 'save-student', onClick: this.save}, 'Save'),
			React.createElement('button', {className: 'demo-student', onClick: this.demo}, 'Demo'))

		return React.createElement('section', {className: 'graduation-status'},
			studentButtons,
			React.createElement(StudentSummary, {student: this.props.student}),
			areaOfStudySections
		)
	}
});

export default GraduationStatus

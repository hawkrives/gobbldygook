'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import AreaOfStudy from './areaOfStudy'
import StudentSummary from './studentSummary'

var GraduationStatus = React.createClass({
	displayName: 'GraduationStatus',
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

		return React.createElement('section', {className: 'graduation-status'},
			React.createElement(StudentSummary, {student: this.props.student}),
			areaOfStudySections
		)
	}
});

export default GraduationStatus

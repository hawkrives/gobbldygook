'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import AreaOfStudy from './areaOfStudy'
import StudentSummary from './studentSummary'

var GraduationStatus = React.createClass({
	render() {
		// console.info('graduation-status render', this.props.student)

		// Get areas of study
		var areasOfStudy = _.mapValues(this.props.student.studies.byType, function(areas) {
			return _.map(areas, function(area) {
				return AreaOfStudy({
					key: area.id,
					student: this.props.student,
					area: area
				})
			}, this)
		}, this)

		var areaOfStudySections = _.map(_.keys(areasOfStudy), function(areaType) {
			var pluralType = humanize.pluralize(2, areaType)
			return React.DOM.section({id: pluralType, key: areaType},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, humanize.capitalize(pluralType)),
					React.DOM.button({
						className: 'add-area-of-study',
						title: 'Add ' + humanize.capitalize(areaType)
					})
				),
				areasOfStudy[areaType]
			)
		})

		return React.DOM.section({className: 'graduation-status'},
			StudentSummary({student: this.props.student}),
			areaOfStudySections
		)
	}
});

export default GraduationStatus

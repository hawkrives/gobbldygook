var _ = require('lodash');
var React = require('react');

var AreaOfStudy = require('./areaOfStudy')
var StudentSummary = require('./studentSummary')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var GraduationStatus = React.createClass({
	render: function() {
		console.log('graduation-status render')

		// Get course objects
		var activeSchedules = _.filter(this.props.schedules, 'active')
		var clbids = _.pluck(activeSchedules, 'clbids')
		var courses = makeCourseObjects(_.uniq(_.flatten(clbids)))

		// Get areas of study
		var areasOfStudy = _.groupBy(this.props.studies, 'type')
		areasOfStudy = _.mapValues(areasOfStudy, function(areas) {
			return _.map(areas, function(area) {
				area.key = area.id
				area.courses = courses
				return AreaOfStudy(area)
			})
		})

		return React.DOM.section( {className:"graduation-status"},
			StudentSummary( _.merge(this.props, {courses: courses}) ),
			React.DOM.section( {id:"degrees"},
				React.DOM.h1(null, "Degrees"),
				areasOfStudy.degree
			),
			React.DOM.section( {id:"majors"},
				React.DOM.h1(null, "Majors"),
				areasOfStudy.major
			),
			React.DOM.section( {id:"concentrations"},
				React.DOM.h1(null, "Concentrations"),
				areasOfStudy.concentration
			)
		)
	}
});

module.exports = GraduationStatus

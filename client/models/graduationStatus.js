var _ = require('lodash');
var React = require('react');

var AreaOfStudy = require('./areaOfStudy')

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
				area.key = area.title
				area.courses = courses
				return AreaOfStudy(area)
			}) 
		})

		return React.DOM.section( {className:"graduation-status"},
			React.DOM.section( {id:"general-education"},
				React.DOM.h1(null, "General Education"),
				React.DOM.p(null, this.props.moniker,"! You have ", React.DOM.output(null, "X"), " of ", React.DOM.output(null, "Y"), " credits!"),
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

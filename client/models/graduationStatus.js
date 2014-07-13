var _ = require('lodash');
var React = require('react');

var AreaOfStudy = require('./areaOfStudy')
var StudentSummary = require('./studentSummary')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var pluckCurried = _.curry(function(key, data) {
	// console.log(data)
	return data[key].val()
})

var log = function(summat) {
	console.log(summat)
}

var GraduationStatus = React.createClass({
	render: function() {
		console.log('graduation-status render')

		// Get course objects
		// console.log('grad-status props', this.props)
		var activeSchedules = _.filter(this.props.schedules.val(), 'active')
		var clbids = _.pluck(activeSchedules, 'clbids')
		var courses = makeCourseObjects(_.uniq(_.flatten(clbids)))

		// Get areas of study
		var areasOfStudy = _.groupBy(this.props.studies.val(), 'type')
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
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Degrees"),
					React.DOM.button({className: "add-area-of-study", title: "Add Degree"}, "+")
				),
				areasOfStudy.degree
			),
			React.DOM.section( {id:"majors"},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Majors"),
					React.DOM.button({className: "add-area-of-study", title: "Add Major"}, "+")
				),
				areasOfStudy.major
			),
			React.DOM.section( {id:"concentrations"},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, "Concentrations"),
					React.DOM.button({className: "add-area-of-study", title: "Add Concentration"}, "+")
				),
				areasOfStudy.concentration
			)
		)
	}
});

module.exports = GraduationStatus

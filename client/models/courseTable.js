var _ = require('lodash')
var React = require('react')

var Course = require('./course')
var Semester = require('./semester')

var CourseTable = React.createClass({
	render: function() {
		console.log('course-table render')
		console.log('course-table schedules', this.props.schedules)

		var years = _.map(_.groupBy(this.props.schedules, 'year'), function(schedulesByYear, year) {
			var terms = _.map(_.groupBy(schedulesByYear, 'semester'), function(schedulesBySemester, semester) {
				var clbids = _.pluck(_.filter(schedulesBySemester, 'active'), 'clbids')
				return Semester( {key:semester, name:semester, clbids:clbids } );
			});
			return React.DOM.div( {className:"year", key:year},
				React.DOM.header({className: "year-title"},
					React.DOM.h1(null,
						React.DOM.span({className: "year-start"}, year),
						React.DOM.span({className: "year-divider"}, "+"),
						React.DOM.span({className: "year-end"}, parseInt(year, 10) + 1)
					)
				),
				terms,
				React.DOM.button({className: "add-semester", title: "Add Semester", disabled: _.size(terms) <= 5 ? false : true}, "+")
			)
		}, this);

		return React.DOM.div( {className:"course-table"}, 
			years,
			React.DOM.button({className: "add-year", title: "Add Year"}, "+")
		);
	}
});

module.exports = CourseTable

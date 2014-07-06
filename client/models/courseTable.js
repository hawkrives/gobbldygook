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
				return Semester( {key:semester, name:semester, schedules:schedulesBySemester} );
			});
			return React.DOM.div( {className:"year", key:year}, 
				React.DOM.header(null, React.DOM.h1(null, year)),
				React.DOM.div( {className:"semester-list"}, 
					terms
				)
			)
		}, this);
		console.log('years', years);
		return React.DOM.div( {className:"course-table"}, years );
	}
});

module.exports = CourseTable

var _ = require('lodash')
var React = require('react')

var Course = require('./course')
var Semester = require('./semester')

var CourseTable = React.createClass({
	render: function() {
		console.log(this.props.courses)
		var years = _.map(_.groupBy(this.props.courses, 'year'), function(coursesByYear, year) {
			var terms = _.map(_.groupBy(coursesByYear, 'term'), function(coursesByTerm, term) {
				return Semester( {key:term, name:term, courses:coursesByTerm} );
			});
			return React.DOM.div( {className:"year", key:year}, 
					React.DOM.header(null, React.DOM.h1(null, year)),
					React.DOM.div( {className:"term-list"}, 
						terms
					)
				)
		}, this);
		console.log(years);
		return React.DOM.div( {className:"course-table"}, years );
	}
});

module.exports = CourseTable

var _ = require('lodash')
var React = require('react')

var Course = require('./course')

var Semester = React.createClass({
	render: function() {
		console.log('semester render')

		var semesterName = 'Unknown (' + this.props.name + ')';

		if (this.props.name === '1') {
			semesterName = 'Fall';
		} else if (this.props.name === '2') {
			semesterName = 'Interim';
		} else if (this.props.name === '3') {
			semesterName = 'Spring';
		} else if (this.props.name === '4') {
			semesterName = 'Early Summer';
		} else if (this.props.name === '5') {
			semesterName = 'Late Summer';
		}

		var courses = _.map(this.props.courses, function(c) {
			return Course( {key:c.clbid, info:c} );
		})

		return (
			React.DOM.div( {className:"term"}, 
				React.DOM.header(null, React.DOM.h1(null, semesterName)),
				React.DOM.div( {className:"course-list"}, 
					courses
				)
			)
		);
	}
});

module.exports = Semester

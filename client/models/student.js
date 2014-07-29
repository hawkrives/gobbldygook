var _ = require('lodash');
var React = require('react');

var GraduationStatus = require('./graduationStatus');
var CourseTable = require('./courseTable');

var Student = React.createClass({
	render: function() {
		// console.log('student render')
		return (
			React.DOM.div({className: 'student'},
				GraduationStatus(this.props),
				CourseTable(
					{schedules: this.props.schedules}
				)
			)
		);
	}
});

module.exports = Student

var _ = require('lodash');
var React = require('react');

var GraduationStatus = require('./graduationStatus');
var CourseTable = require('./courseTable');

var Student = React.createClass({
	render: function() {
		// console.log('student render')
		var student = _.clone(this.props.student.val(), true)
		return (
			React.DOM.div({className: 'student'},
				GraduationStatus({student: student}),
				CourseTable(
					{schedules: this.props.student.schedules}
				)
			)
		);
	}
});

module.exports = Student

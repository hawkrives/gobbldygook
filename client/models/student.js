'use strict';

var _ = require('lodash')
var React = require('react')

var GraduationStatus = require('./graduationStatus')
var CourseTable = require('./courseTable')

var StudentStore = require('../stores/StudentStore')
var StudentConstants = require('../constants/StudentConstants')

// Retrieve the current student data from the StudentStore
function getStudentData() {
	return {
		allStudents: StudentStore.get('students'),
		currentStudent: StudentStore.getActiveStudent()
	}
}

var Student = React.createClass({
	getInitialState: function() {
		return getStudentData()
	},

	componentDidMount: function() {
		StudentStore.addWatch(this._onChange)
	},

	componentWillUnmount: function() {
		StudentStore.removeWatch(this._onChange)
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return !StudentStore.$equals(this.state.currentStudent, nextState.currentStudent)
	},

	render: function() {
		// console.log('student render')
		var student = StudentStore.toJS(this.state.currentStudent)
		return (
			React.DOM.div(
				{className: 'student'},
				GraduationStatus({student: student}),
				CourseTable({schedules: student.schedules, studentId: student.id})
			)
		)
	},

	_onChange: function(keys, oldState, newState) {
		this.setState(getStudentData())
	}
})

module.exports = Student

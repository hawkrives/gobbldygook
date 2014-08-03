'use strict';

var _ = require('lodash')
var React = require('react')
var mori = require('mori')

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
		var student = this.state.currentStudent
		console.info('student render', mori.clj_to_js(student))
		return React.DOM.div(
			{className: 'student'},
			GraduationStatus({student: student}),
			CourseTable({
				schedules: mori.clj_to_js(mori.get(student, 'schedules')),
				studentId: mori.get(student, 'id')
			})
		)
	},

	_onChange: function(keys, oldState, newState) {
		this.setState(getStudentData())
	}
})

module.exports = Student

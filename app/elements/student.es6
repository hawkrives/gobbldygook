import * as React from 'react'
import {State, RouteHandler} from 'react-router'

import GraduationStatus from 'elements/graduationStatus'
import CourseTable from 'elements/courseTable'

var Student = React.createClass({
	render() {
		// console.info('student render', this.props.student)
		return React.createElement('div', {className: 'student'},
			React.createElement(GraduationStatus, {student: this.props.student}),
			React.createElement(CourseTable, {
				schedules: this.props.student.schedules,
				matriculation: this.props.student.matriculation}))
	},
})

export default Student

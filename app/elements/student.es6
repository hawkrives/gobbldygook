'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import GraduationStatus from './graduationStatus.es6'
import CourseTable from './courseTable.es6'

var Student = React.createClass({
	displayName: 'Student',
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

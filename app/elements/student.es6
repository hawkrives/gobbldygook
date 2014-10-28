'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import GraduationStatus from './graduationStatus'
import CourseTable from './courseTable'

var Student = React.createClass({
	render() {
		// console.info('student render', this.props.student)
		return React.DOM.div({className: 'student'},
			GraduationStatus({student: this.props.student}),
			CourseTable({schedules: this.props.student.schedules}))
	},
})

export default Student

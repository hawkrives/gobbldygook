'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as Reflux from 'reflux'

import GraduationStatus from './graduationStatus'
import CourseTable from './courseTable'

import studentStore from '../stores/studentStore.reflux'

studentStore.listen(function(status) {
	console.log('student status: ', status);
});

var Student = React.createClass({
	mixins: [Reflux.connect(studentStore, 'activeStudent')],

	getInitialState() {
		return {
			activeStudent: {
				schedules: []
			}
		}
	},

	render() {
		var student = this.state.activeStudent
		console.info('student render', student)
		return React.DOM.div({className: 'student'},
			GraduationStatus({student: student}),
			CourseTable({student: student}))
	},
})

export default Student

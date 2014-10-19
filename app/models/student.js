'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as Fluxxor from 'fluxxor'
var FluxMixin = Fluxxor.FluxMixin(React)
var StoreWatchMixin = Fluxxor.StoreWatchMixin

import GraduationStatus from './graduationStatus'
import CourseTable from './courseTable'

import StudentStore from '../stores/StudentStore'
import StudentConstants from '../constants/StudentConstants'

var Student = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin('StudentStore')],

	getStateFromFlux() {
		var flux = this.getFlux()
		console.log(flux.store('StudentStore').getState())
		return flux.store('StudentStore').getState()
	},

	// shouldComponentUpdate(nextProps, nextState) {
		// return !StudentStore.$equals(this.state.currentStudent, nextState.currentStudent)
		// return true
	// },

	render() {
		var student = this.state.active
		console.info('student render', student)
		return React.DOM.div(
			{className: 'student'},
			GraduationStatus({student: student}),
			CourseTable({
				schedules: student.schedules,
				studentId: student.id,
			})
		)
	},
})

export default Student

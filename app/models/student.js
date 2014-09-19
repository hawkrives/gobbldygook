'use strict';

var _ = require('lodash')
var React = require('react')
var Fluxxor = require('fluxxor')
var FluxMixin = Fluxxor.FluxMixin(React)
var StoreWatchMixin = Fluxxor.StoreWatchMixin

var GraduationStatus = require('./graduationStatus')
var CourseTable = require('./courseTable')

var StudentStore = require('../stores/StudentStore')
var StudentConstants = require('../constants/StudentConstants')

var Student = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin('StudentStore')],

	getStateFromFlux: function() {
		var flux = this.getFlux()
		console.log(flux.store('StudentStore').getState())
		return flux.store('StudentStore').getState()
	},

	// shouldComponentUpdate: function(nextProps, nextState) {
		// return !StudentStore.$equals(this.state.currentStudent, nextState.currentStudent)
		// return true
	// },

	render: function() {
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

module.exports = Student

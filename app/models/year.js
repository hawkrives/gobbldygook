'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as Fluxxor from 'fluxxor'
var FluxChildMixin = Fluxxor.FluxChildMixin(React)

import Course from './course'
import Semester from './semester'

import findFirstAvailableSemester from '../helpers/findFirstAvailableSemester'
import calculateNextScheduleId from '../helpers/calculateNextScheduleId'

var isCurrentYearSchedule = _.curry(function(year, schedule) {
	return (schedule.year === year)
})

var Year = React.createClass({
	mixins: [FluxChildMixin],

	canAddSemester() {
		return findFirstAvailableSemester(this.props.schedules, this.props.year) <= 5
	},

	addSemester() {
		var nextAvailableSemester = findFirstAvailableSemester(this.props.schedules, this.props.year)

		this.getFlux().actions.createSchedule(this.props.studentId, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		var currentYearSchedules = _.filter(this.props.schedules, isCurrentYearSchedule(this.props.year))
		console.log('called removeYear', currentYearSchedules)
		var scheduleIds = _.pluck(currentYearSchedules, 'id')
		console.log('removing', scheduleIds, 'from', this.props.studentId)
		this.getFlux().actions.destroyMultipleSchedules(this.props.studentId, scheduleIds)
	},

	render() {
		var schedules = _.filter(this.props.schedules, {year: this.props.year})

		var terms = _.map(_.groupBy(schedules, 'semester'), function(schedule, semester) {
			semester = parseInt(semester, 10)
			return Semester({
				key: semester,
				ref: semester,
				semester: parseInt(semester, 10),
				year: this.props.year,
				schedules: this.props.schedules,
				studentId: this.props.studentId,
			})
		}, this)

		return React.DOM.div({className: 'year'},
			React.DOM.header({className: 'year-title'},
				React.DOM.h1(null, this.props.year + ' + ' + (this.props.year + 1)),
				React.DOM.button({
					className: 'remove-year',
					title: 'Remove the year ' + this.props.year,
					onClick: this.removeYear,
				})
			),
			React.DOM.div({className: 'semester-list'}, terms),
			React.DOM.button({
				className: 'add-semester',
				title: 'Add Semester',
				disabled: !this.canAddSemester(),
				onClick: this.addSemester,
			})
		)
	}
})

export default Year

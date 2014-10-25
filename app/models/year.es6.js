'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Course from './course'
import Semester from './semester'

import findFirstAvailableSemester from '../helpers/findFirstAvailableSemester'
import calculateNextScheduleId from '../helpers/calculateNextScheduleId'

var isCurrentYearSchedule = _.curry(function(year, schedule) {
	return (schedule.year === year)
})

var Year = React.createClass({
	canAddSemester() {
		return findFirstAvailableSemester(this.props.schedules, this.props.year) <= 5
	},

	addSemester() {
		var nextAvailableSemester = findFirstAvailableSemester(this.props.schedules, this.props.year)

		this.props.schedules.create({
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		var currentYearSchedules = _.filter(this.props.schedules, isCurrentYearSchedule(this.props.year))
		var scheduleIds = _.pluck(currentYearSchedules, 'id')

		this.props.schedules.destroyMultiple(scheduleIds)
	},

	render() {
		var thisYearSchedules = this.props.schedules.byYear[this.props.year]
		let schedules = _.chain(thisYearSchedules).filter('active').groupBy('semester').value()

		var terms = _.map(schedules, function(schedule, semester) {
			semester = parseInt(semester, 10)
			return Semester({
				key: semester,
				ref: semester,
				semester: semester,
				year: this.props.year,
				schedules: this.props.schedules,
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

import * as _ from 'lodash'
import * as React from 'react'

import Course from 'elements/course'
import Semester from 'elements/semester'

import {expandYear} from 'helpers/semesterName'
import findFirstAvailableSemester from 'helpers/findFirstAvailableSemester'
import calculateNextScheduleId from 'helpers/calculateNextScheduleId'

var isCurrentYearSchedule = _.curry((year, schedule) => {
	return (schedule.year === year)
})

var Year = React.createClass({
	canAddSemester() {
		return findFirstAvailableSemester(this.props.schedules.data, this.props.year) <= 5
	},

	addSemester() {
		var nextAvailableSemester = findFirstAvailableSemester(this.props.schedules.data, this.props.year)

		this.props.schedules.create({
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		var currentYearSchedules = _.filter(this.props.schedules.data, isCurrentYearSchedule(this.props.year))
		var scheduleIds = _.pluck(currentYearSchedules, 'id')

		this.props.schedules.destroyMultiple(scheduleIds)
	},

	render() {
		var thisYearSchedules = this.props.schedules.byYear[this.props.year]
		let schedules = _.chain(thisYearSchedules).filter('active').groupBy('semester').value()

		var terms = _.map(schedules, function(schedule, semester) {
			semester = parseInt(semester, 10)
			return React.createElement(Semester, {
				key: semester,
				ref: semester,
				semester: semester,
				year: this.props.year,
				schedules: this.props.schedules,
			})
		}, this)

		return React.createElement('div', {className: 'year'},
			React.createElement('header', {className: 'year-title'},
				React.createElement('h1', null, expandYear(this.props.year)),
				React.createElement('button', {
					className: 'remove-year',
					title: 'Remove the year ' + this.props.year,
					onClick: this.removeYear,
				})
			),
			React.createElement('div', {className: 'semester-list'}, terms),
			React.createElement('button', {
				className: 'add-semester',
				title: 'Add Semester',
				disabled: !this.canAddSemester(),
				onClick: this.addSemester,
			})
		)
	}
})

export default Year

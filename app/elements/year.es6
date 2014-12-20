import * as _ from 'lodash'
import * as React from 'react'

import Course from 'elements/course'
import Semester from 'elements/semester'

import studentActions from 'flux/studentActions'
import {expandYear} from 'helpers/semesterName'
import findFirstAvailableSemester from 'helpers/findFirstAvailableSemester'
import calculateNextScheduleId from 'helpers/calculateNextScheduleId'

var Year = React.createClass({
	canAddSemester() {
		return findFirstAvailableSemester(this.props.schedules, this.props.year) <= 5
	},

	addSemester() {
		var nextAvailableSemester = findFirstAvailableSemester(this.props.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		var currentYearSchedules = this.props.schedules.filter((s) => s.year === this.props.year)
		var scheduleIds = currentYearSchedules.map((s) => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	render() {
		var thisYearSchedules = this.props.schedules.byYear.get(this.props.year)
		let schedules = thisYearSchedules.filter((s) => s.active).groupBy((s) => s.semester)

		var terms = schedules.map((schedule, semester) => {
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
	},
})

export default Year

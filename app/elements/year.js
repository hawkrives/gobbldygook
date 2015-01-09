import React from 'react'
import Immutable from 'immutable'

import Course from 'app/elements/course'
import Semester from 'app/elements/semester'

import studentActions from 'app/flux/studentActions'
import {isCurrentYear} from 'sto-helpers/lib/isCurrent'
import expandYear from 'sto-helpers/lib/expandYear'
import findFirstAvailableSemester from 'sto-helpers/lib/findFirstAvailableSemester'
import calculateNextScheduleId from 'sto-helpers/lib/calculateNextScheduleId'

let Year = React.createClass({
	canAddSemester() {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	},

	addSemester() {
		let nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		let currentYearSchedules = this.props.student.schedules.filter(isCurrentYear(this.props.year))
		let scheduleIds = currentYearSchedules.map(s => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	getInitialState() {
		return {
			schedules: Immutable.List()
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let thisYearSchedules = nextProps.student.schedulesByYear.get(nextProps.year)
		let schedules = thisYearSchedules.filter(s => s.active)
		this.setState({schedules})
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.schedules !== this.state.schedules
	},

	render() {
		let terms = this.state.schedules
			.sortBy(schedule => schedule.semester)
			.map((schedule) =>
				React.createElement(Semester, {
					key: `${schedule.year}-${schedule.semester}-${schedule.id}`,
					student: this.props.student,
					semester: schedule.semester,
					year: this.props.year,
				}))
			.toList()

		let niceYear = expandYear(this.props.year)

		return React.createElement('div', {className: 'year'},
			React.createElement('header', {className: 'year-title'},
				React.createElement('h1', null, niceYear),
				React.createElement('button', {
					className: 'remove-year',
					title: `Remove the year ${niceYear}`,
					onClick: this.removeYear,
				})
			),
			React.createElement('div',
				{className: 'semester-list'},
				terms.toJS()
			),
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

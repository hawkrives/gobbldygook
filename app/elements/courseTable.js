import * as _ from 'lodash'
import * as React from 'react'

import studentActions from 'app/flux/studentActions'
import findFirstAvailableYear from 'app/helpers/findFirstAvailableYear'
import Year from 'app/elements/year'

let CourseTable = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,

	},

	addYear() {
		let nextAvailableYear = findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation)

		studentActions.addSchedule(this.props.student.id, {
			year: nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('course-table render', this.props)
		if (!this.props.student)
			return null;

		let years = this.props.student.schedules
			.sortBy(schedule => schedule.year)
			.groupBy(schedule => schedule.year)
			.map((schedules, year) =>
				React.createElement(Year, {
					student: this.props.student,
					year: year,
					key: year,
				}))
			.toList()

		return React.createElement('div', {className: 'course-table'},
			years.toArray(),
			React.createElement('button', {
				className: 'add-year',
				title: 'Add Year',
				onClick: this.addYear,
			}))
	},
})

export default CourseTable

import * as _ from 'lodash'
import * as React from 'react'

import findFirstAvailableYear from 'helpers/findFirstAvailableYear'

import Year from 'elements/year'

let CourseTable = React.createClass({
	addYear() {
		let nextAvailableYear = findFirstAvailableYear(this.props.schedules, this.props.matriculation)

		studentActions.createSchedule(this.props.student.id, {
			year: nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('course-table render', this.props)
		if (!this.props.student)
			return null;

		let years = this.props.student.schedulesByYear.map((schedules, year) => {
			return React.createElement(Year, {
				student: this.props.student,
				year: year,
				key: year,
			})
		}).toList()

		return React.createElement('div', {className: 'course-table'},
			years.toJS(),
			React.createElement('button', {
				className: 'add-year',
				title: 'Add Year',
				onClick: this.addYear,
			}))
	},
})

export default CourseTable

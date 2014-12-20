import * as _ from 'lodash'
import * as React from 'react'

import findFirstAvailableYear from 'helpers/findFirstAvailableYear'

import Year from 'elements/year'

var CourseTable = React.createClass({
	addYear() {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules, this.props.matriculation)

		studentActions.createSchedule(this.props.student.id, {
			year: nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('course-table render', this.props)
		if (!this.props.student)
			return null;

		var years = this.props.student.schedules.byYear.map((schedules, year) => {
			return React.createElement(Year, {
				schedules: this.props.student.schedules,
				year: parseInt(year, 10),
				key: year,
			})
		})

		return React.createElement('div', {className: 'course-table'},
			years,
			React.createElement('button', {
				className: 'add-year',
				title: 'Add Year',
				onClick: this.addYear,
			}))
	},
})

export default CourseTable

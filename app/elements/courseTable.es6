import * as _ from 'lodash'
import * as React from 'react'

import findFirstAvailableYear from 'helpers/findFirstAvailableYear'

import Year from 'elements/year'

var CourseTable = React.createClass({
	addYear(ev) {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules.data, this.props.matriculation)

		this.props.schedules.create({
			year: nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('course-table render', this.props)
		if (!this.props.schedules)
			return null;

		var years = _.map(this.props.schedules.byYear, (schedules, year) => {
			return React.createElement(Year, {
				schedules: this.props.schedules,
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
	}
})

export default CourseTable

'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import findFirstAvailableYear from '../helpers/findFirstAvailableYear'

import Year from './year'

var CourseTable = React.createClass({
	displayName: 'CourseTable',
	addYear(ev) {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules, this.props.matriculation)

		this.props.schedules.create({
			year: nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('course-table render', this.props)
		var years = _.map(this.props.schedules.byYear, function(schedules, year) {
			return React.createElement(Year, {
				schedules: this.props.schedules,
				year: parseInt(year, 10),
				key: year,
			})
		}, this)

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

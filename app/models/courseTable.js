'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import findFirstAvailableYear from '../helpers/findFirstAvailableYear'
import calculateNextScheduleId from '../helpers/calculateNextScheduleId'
import {Schedule as scheduleActions} from '../actions/Actions.reflux'

import Year from './year'

var CourseTable = React.createClass({
	addYear(ev) {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules)

		scheduleActions.create({studentId: this.props.studentId, schedule: {
			year: nextAvailableYear, semester: 1,
			sequence: 1, active: true,
		}})
	},
	render() {
		// console.log('course-table render', this.props.schedules)
		var schedulesByYear = _.groupBy(this.props.schedules, 'year')
		var years = _.map(schedulesByYear, function(schedules, year) {
			return Year({
				schedules: this.props.schedules,
				year: parseInt(year, 10),
				key: year,
				studentId: this.props.studentId,
			})
		}, this)

		return React.DOM.div({className: 'course-table'},
			years,
			React.DOM.button({
				className: 'add-year',
				title: 'Add Year',
				onClick: this.addYear,
			}))
	}
})

export default CourseTable

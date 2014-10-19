'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as Fluxxor from 'fluxxor'
var FluxChildMixin = Fluxxor.FluxChildMixin(React)

import findFirstAvailableYear from '../helpers/findFirstAvailableYear'
import calculateNextScheduleId from '../helpers/calculateNextScheduleId'

import Year from './year'

var CourseTable = React.createClass({
	mixins: [FluxChildMixin],
	addYear(ev) {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules)

		this.getFlux().actions.createSchedule(this.props.studentId, {
			year: nextAvailableYear, semester: 1,
			sequence: 1, active: true,
		})
	},
	render() {
		// console.log('course-table render', this.props.schedules)

		var years = _.map(_.groupBy(this.props.schedules, 'year'), function(schedules, year) {
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
			})
		)
	}
})

export default CourseTable

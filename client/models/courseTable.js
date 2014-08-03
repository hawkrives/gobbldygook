'use strict';

var _ = require('lodash')
var React = require('react')
var mori = require('mori')

var Year = require('./year')
var ScheduleActions = require('../actions/ScheduleActions')

var findFirstAvailableYear = require('../helpers/findFirstAvailableYear')
var calculateNextScheduleId = require('../helpers/calculateNextScheduleId')

var CourseTable = React.createClass({
	addYear: function(ev) {
		var nextAvailableYear = findFirstAvailableYear(this.props.schedules)

		ScheduleActions.create(this.props.studentId, {
			year: nextAvailableYear, semester: 1,
			sequence: 1, active: true,
		})
	},
	render: function() {
		// console.log('course-table render', this.props.schedules)

		var years = _.map(_.groupBy(this.props.schedules, 'year'), function(schedules, year) {
			return Year(
				{
					schedules: this.props.schedules,
					year: parseInt(year, 10),
					key: year,
					studentId: this.props.studentId,
				}
			)
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

module.exports = CourseTable

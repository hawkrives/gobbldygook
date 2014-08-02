var _ = require('lodash')
var React = require('react')
var mori = require('mori')

var Year = require('./year')

var findFirstAvailableYear = require('../helpers/findFirstAvailableYear')
var calculateNextScheduleId = require('../helpers/calculateNextScheduleId')

var CourseTable = React.createClass({
	addYear: function(ev) {
		var schedules = this.props.schedules
		var nextAvailableYear = findFirstAvailableYear(schedules)
		var nextId = calculateNextScheduleId(schedules)
		ScheduleActions.create({
			year: nextAvailableYear, semester: 1,
			title: 'Schedule 1', sequence: 1,
			clbids: [], active: true,
		})
	},
	render: function() {
		// console.log('course-table render')

		var years = _.map(_.groupBy(mori.clj_to_js(this.props.schedules), 'year'), function(schedules, year) {
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

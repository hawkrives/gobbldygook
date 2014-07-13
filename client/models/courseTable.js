var _ = require('lodash')
var React = require('react')

var Year = require('./year')

var findFirstAvailableYear = require('../helpers/findFirstAvailableYear')
var calculateNextScheduleId = require('../helpers/calculateNextScheduleId')

var CourseTable = React.createClass({
	addYear: function(ev) {
		var schedules = this.props.schedules.val()
		var nextAvailableYear = findFirstAvailableYear(schedules)
		var nextId = calculateNextScheduleId(schedules)
		console.log('nextAvailableYear', nextAvailableYear)
		console.log('nextId', nextId)
		this.props.schedules.push({
			id: nextId, year: nextAvailableYear, semester: 1,
			title: "Schedule 1", sequence: 1,
			clbids: [], active: true,
		})

	},
	render: function() {
		console.log('course-table render')
		console.log('course-table schedules', this.props.schedules.val())

		var years = _.map(_.groupBy(this.props.schedules.val(), 'year'), function(schedulesByYear, year) {
			return Year( {schedules: schedulesByYear, year: year, key:year} )
		}, this)

		return React.DOM.div( {className:"course-table"}, 
			years,
			React.DOM.button(
				{
					className: "add-year", 
					title: "Add Year",
					onClick: this.addYear,
				}, 
				"+")
		)
	}
})

module.exports = CourseTable

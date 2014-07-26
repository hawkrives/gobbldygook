var _ = require('lodash')
var React = require('react')

var Course = require('./course')
var Semester = require('./semester')

var findFirstAvailableSemester = require('../helpers/findFirstAvailableSemester')
var calculateNextScheduleId = require('../helpers/calculateNextScheduleId')

var isCurrentYearSchedule = _.curry(function(year, schedule) {
	return (schedule.year.val() === year)
})

var Year = React.createClass({
	canAddSemester: function() {
		return !(findFirstAvailableSemester(this.props.schedules.val(), this.props.year) > 5)
	},
	addSemester: function() {
		var schedules = this.props.schedules.val()
		var nextAvailableSemester = findFirstAvailableSemester(schedules, this.props.year)
		var nextId = calculateNextScheduleId(schedules)

		this.props.schedules.push({
			id: nextId, year: this.props.year, semester: nextAvailableSemester,
			title: "Schedule 1", sequence: 1,
			clbids: [], active: true,
		})
	},
	removeYear: function() {
		console.log('called removeYear')
		var indices = this.props.schedules.findIndices(isCurrentYearSchedule(this.props.year))
		console.log('indices to delete', indices)
		this.props.schedules.removeSeveral(indices)
		// this.props.schedules.forEach(function(schedule, index) {
		// 	if (isCurrentYearSchedule(this.props.year, schedule)) {
		// 		this.props.schedules.removeAt(index)
		// 	}
		// })
	},
	render: function() {
		var schedules = _.filter(this.props.schedules.val(), {year: this.props.year})

		var terms = _.map(_.groupBy(schedules, 'semester'), function(schedule, semester) {
			semester = parseInt(semester, 10)
			return Semester({
				key: semester,
				ref: semester,
				semester: parseInt(semester, 10),
				year: this.props.year,
				schedules: this.props.schedules
			})
		}, this)

		return React.DOM.div( {className:"year"},
			React.DOM.header({className: "year-title"},
				React.DOM.h1(null,
					React.DOM.span({className: "year-start"}, this.props.year),
					React.DOM.span({className: "year-divider"}, "+"),
					React.DOM.span({className: "year-end"}, this.props.year + 1)
				),
				React.DOM.button({
					className: "remove-year",
					title: "Remove the year " + this.props.year,
					onClick: this.removeYear,
				})
			),
			terms,
			React.DOM.button({
				className: "add-semester",
				title: "Add Semester",
				disabled: !this.canAddSemester(),
				onClick: this.addSemester,
			})
		)
	}
})

module.exports = Year

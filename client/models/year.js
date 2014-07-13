var _ = require('lodash')
var React = require('react')

var Course = require('./course')
var Semester = require('./semester')

var findFirstAvailableSemester = require('../helpers/findFirstAvailableSemester')
var calculateNextScheduleId = require('../helpers/calculateNextScheduleId')

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
	render: function() {
		var schedules = _.filter(this.props.schedules.val(), {year: this.props.year})

		var terms = _.map(_.groupBy(schedules, 'semester'), function(schedule, semester) {
			var clbids = _.pluck(_.filter(schedule, 'active'), 'clbids')
			return Semester( {key:semester, name:semester, clbids:clbids } );
		}, this)

		return React.DOM.div( {className:"year"},
			React.DOM.header({className: "year-title"},
				React.DOM.h1(null,
					React.DOM.span({className: "year-start"}, this.props.year),
					React.DOM.span({className: "year-divider"}, "+"),
				)
					React.DOM.span({className: "year-end"}, this.props.year + 1)
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

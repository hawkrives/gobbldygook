var _ = require('lodash')
var React = require('react')

var Course = require('./course')
var Semester = require('./semester')

var Year = React.createClass({
	addSemester: function() {
		console.log('addSemester', arguments)
	},
	render: function() {
		var terms = _.map(_.groupBy(this.props.schedules, 'semester'), function(schedulesBySemester, semester) {
			var clbids = _.pluck(_.filter(schedulesBySemester, 'active'), 'clbids')
			return Semester( {key:semester, name:semester, clbids:clbids } );
		}, this)

		return React.DOM.div( {className:"year"},
			React.DOM.header({className: "year-title"},
				React.DOM.h1(null,
					React.DOM.span({className: "year-start"}, this.props.year),
					React.DOM.span({className: "year-divider"}, "+"),
					React.DOM.span({className: "year-end"}, parseInt(this.props.year, 10) + 1)
				)
			),
			terms,
			React.DOM.button(
				{
					className: "add-semester", 
					title: "Add Semester", 
					disabled: _.size(terms) <= 5 ? false : true,
					onClick: this.addSemester,
				},
				"+")
		)
	}
})

module.exports = Year

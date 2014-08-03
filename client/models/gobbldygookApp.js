var _ = require('lodash')
var React = require('react')

var Student = require('./student')
// var NotificationCenter = require('./toast').NotificationContainer

var Gobbldygook = React.createClass({
	render: function() {
		return React.DOM.div(
			null,
			// NotificationCenter(),
			Student()
		)
	}
})

module.exports = Gobbldygook

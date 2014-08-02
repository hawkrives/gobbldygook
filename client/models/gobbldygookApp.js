var _ = require('lodash')
var Promise = require('bluebird')
var React = require('react')
var Fluxy = require('fluxy')

var Student = require('./student')
// var NotificationCenter = require('./toast').NotificationContainer

var Gobbldygook = React.createClass({
	render: function() {
		return React.DOM.div(
			null,
			Student()//,
			// NotificationCenter()
		)
	}
})

module.exports = Gobbldygook

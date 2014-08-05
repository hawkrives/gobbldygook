'use strict';

var _ = require('lodash')
var React = require('react')

var SingleRequirement = React.createClass({
	render: function() {
		return (
			React.DOM.div(null)
		)
	}
})

var RequirementGroup = React.createClass({
	render: function() {
		return (
			React.DOM.div(null)
		)
	}
})

var Requirement = React.createClass({
	render: function() {
		// console.log('requirement render')
		return React.DOM.li({className: 'requirement'},
			React.DOM.progress({value: this.props.has, max: this.props.needs}),
			this.props.name,
			React.DOM.br(null),
			this.props.query, this.props.validCourses
		)
	}
})

module.exports = Requirement

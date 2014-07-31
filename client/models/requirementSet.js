var _ = require('lodash')
var React = require('react')

var Requirement = require('./requirement')

function findType(result, details) {
	if (_.isArray(details) && findType(details.result, details.details) === 'object/boolean') {
		return 'array/requirementSet'
	}

	else if (_.isUndefined(details) && _.isBoolean(result)) {
		return 'boolean'
	}

	else if (_.isPlainObject(details)) {
		if (_.every(details, _.isBoolean)) {
			return 'object/boolean'
		}
		else if (_.some(details, _.isNumber)) {
			return 'object/number'
		}
	}

	else {
		return null
	}
}

var BooleanRequirement = React.createClass({
	render: function() {
		return React.DOM.div(
			{
				className: 'requirement-result requirement-result-boolean'
			},
			React.DOM.span(
				{className: this.props.result ? ' completed' : ' incomplete'},
				this.props.result ? 'Completed' : 'Incomplete')
		)
	}
})

var BooleanObjectRequirement = React.createClass({
	render: function() {
		// console.log('BooleanObjectRequirement', this.props)
		return React.DOM.div(
			{className: 'requirement-result requirement-result-object-boolean'},
			React.DOM.ul(
				{className: 'requirement-detail-list'},
				_.map(this.props.details, function(result, requirement) {
					return React.DOM.li(
						{
							key: requirement,
							className: result ? 'completed' : 'incomplete',
							title: requirement + ': ' + (result ? 'Completed.' : 'Incomplete!')
						},
						requirement
					)
				})
			)
		)
	}
})

var NumberObjectRequirement = React.createClass({
	render: function() {
		return React.DOM.div(
			{className: 'requirement-result requirement-result-object-number'},
			React.DOM.span(
				{className: this.props.result ? 'completed' : 'incomplete'},
				this.props.details.has, ' of ', this.props.details.needs
			),
			React.DOM.ul(
				{className: 'requirement-detail-list'},
				_.map(this.props.details.matches, function(match) {
					return React.DOM.li({key: match.deptnum}, match.deptnum)
				})
			)
		)
	}
})

var RequirementSet = React.createClass({
	render: function() {
		// console.log('requirement-set render', this.props)

		var details = undefined
		var type = findType(this.props.result, this.props.details)

		if (type === 'array') {
			details = _.map(this.props.details, function(requirement, index) {
				// console.log('map', requirement, index)
				return RequirementSet({
					key: index,
					title: requirement.title,
					description: requirement.description,
					result: requirement.result,
					details: requirement.details
				})
			})
		}

		else if (type === 'boolean') {
			details = BooleanRequirement({result: this.props.result})
		}

		else if (type === 'object/boolean') {
			details = BooleanObjectRequirement({details: this.props.details})
		}

		else if (type === 'object/number') {
			details = NumberObjectRequirement({result: this.props.result, details: this.props.details})
		}

		return (
			React.DOM.div(
				{
					className: 'requirement-set',
					'data-type': type || 'weird',
				},
				React.DOM.h2(
					{
						className: this.props.result ? 'completed' : 'incomplete',
						title: this.props.description,
					},
					this.props.title
				),
				details
			)
		)
	}
})

module.exports = RequirementSet

var _ = require('lodash')
var React = require('react')

var Requirement = require('./requirement')

var RequirementSet = React.createClass({
	render: function() {
		// console.log('requirement-set render')
		// var requirements = _.map(this.props.requirements, function(req) {
		// 	return Requirement({key: req.title,
		// 		name: req.title, needs: req.needs,
		// 		validCourses: req.courses,
		// 		query: req.query,
		// 		courses: this.props.courses
		// 	})
		// }, this);

		// if (this.props.type === )

		var details = undefined

		if (this.props.type === 'array') {
			details = undefined
		} else if (this.props.type === 'boolean') {
			details = React.DOM.div(
				{
					className: 'requirement-result requirement-result-boolean' +
					(this.props.result ? ' completed' : ' incomplete')
				},
				React.DOM.span(null, this.props.result ? 'Completed' : 'Incomplete')
			)
		} else if (this.props.type === 'object/boolean') {
			details = React.DOM.div(
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
		} else if (this.props.type === 'object/number') {
			details = React.DOM.div(
				{className: 'requirement-result requirement-result-object-number'},
				React.DOM.span(
					{className: this.props.result ? 'completed' : 'incomplete'},
					this.props.details.has, ' of ', this.props.details.needs
				),
				React.DOM.ul(
					{className: 'requirement-detail-list'},
					_.map(this.props.details.matches, function(match) {
						return React.DOM.li({key: match}, match)
					})
				)
			)
		}

		return (
			React.DOM.div(
				{className: 'requirement-set'},
				React.DOM.h2(
					{
						className: this.props.result ? 'completed' : 'incomplete',
						title: this.props.description,
					},
					this.props.title
				),
				details
				// React.DOM.ul({className: 'requirement-list'},
				// 	requirements
				// )
			)
		)
	}
})

module.exports = RequirementSet

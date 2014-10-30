'use strict';

import * as _ from 'lodash'
import * as React from 'react'

var BooleanRequirement = React.createClass({
	displayName: 'BooleanRequirement',
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-boolean'},
			React.createElement('span',
				{className: this.props.result ? ' completed' : ' incomplete'},
				this.props.result ? 'Completed' : 'Incomplete')
		)
	}
})

var BooleanArrayRequirement = React.createClass({
	displayName: 'BooleanArrayRequirement',
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-boolean-array'},
			React.createElement('ul',
				{className: 'requirement-detail-list'},
				_.map(this.props.details, function(req) {
					return React.createElement('li',
						{
							key: req.title,
							className: req.result ? 'completed' : 'incomplete',
							title: req.title + ': ' + (req.result ? 'Completed.' : 'Incomplete!')
						},
						(req.abbr || req.title)
					)
				})
			)
		)
	}
})

var NumberObjectRequirement = React.createClass({
	displayName: 'NumberObjectRequirement',
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-object-number'},
			React.createElement('span',
				{className: this.props.result ? 'completed' : 'incomplete'},
				this.props.details.has, ' of ', this.props.details.needs
			),
			React.createElement('ul',
				{className: 'requirement-detail-list'},
				_.map(this.props.details.matches, function(match) {
					return React.createElement('li',{key: match.deptnum}, match.deptnum)
				})
			)
		)
	}
})

var RequirementSet = React.createClass({
	displayName: 'RequirementSet',
	render() {
		// console.log('requirement-set render', this.props)

		var details;
		var type = this.props.type

		if (type === 'array/requirementSet') {
			details = _.map(this.props.details, function(requirement, index) {
				return React.createElement(RequirementSet, _.merge({key: index}, requirement))
			})
		}

		else if (type === 'array/boolean') {
			details = React.createElement(BooleanArrayRequirement, {details: this.props.details})
		}

		else if (type === 'boolean') {
			details = React.createElement(BooleanRequirement, {result: this.props.result})
		}

		else if (type === 'object/number') {
			details = React.createElement(NumberObjectRequirement, {result: this.props.result, details: this.props.details})
		}

		return React.createElement('div', {className: 'requirement-set', 'data-type': type},
			React.createElement('h2',
				{
					className: this.props.result ? 'completed' : 'incomplete',
					title: this.props.description,
				},
				this.props.title
			),
			details)
	}
})

export default RequirementSet

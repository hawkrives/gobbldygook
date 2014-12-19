import * as _ from 'lodash'
import * as React from 'react/addons'

var BooleanRequirement = React.createClass({
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-boolean'},
			React.createElement('span',
				{
					className: React.addons.classSet({
						requirement: true,
						completed: this.props.result,
						incomplete: !this.props.result,
					})
				},
				this.props.result ? 'Completed' : 'Incomplete')
		)
	}
})

var SomeArrayRequirement = React.createClass({
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-some-array'},
			(this.props.details.has || this.props.details.needs || this.props.details.word) ?
				React.createElement('span',
					{
						className: React.addons.classSet({
							requirement: true,
							completed: this.props.result,
							incomplete: !this.props.result,
						})
					},
					this.props.details.has,
					this.props.details.word ? this.props.details.word : ' of ',
					this.props.details.needs) : null,
			React.createElement('ul',
				{className: 'requirement-detail-list'},
				_.map(this.props.details.from, (req) => {
					return React.createElement('li',
						{
							key: req.title,
							title: req.title,
							className: React.addons.classSet({
								requirement: true,
								completed: req.result,
								nope: !req.result,
							})
						},
						(req.abbr || req.title)
					)
				})
			)
		)
	}
})

var BooleanArrayRequirement = React.createClass({
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-boolean-array'},
			React.createElement('ul',
				{className: 'requirement-detail-list'},
				_.map(this.props.details, (req) => {
					return React.createElement('li',
						{
							key: req.title,
							title: req.title + ': ' + (req.result ? 'Completed.' : 'Incomplete!'),
							className: React.addons.classSet({
								requirement: true,
								completed: req.result,
								incomplete: !req.result,
							})
						},
						(req.abbr || req.title)
					)
				})
			)
		)
	}
})

var NumberObjectRequirement = React.createClass({
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-object-number'},
			React.createElement('span',
				{
					className: React.addons.classSet({
						requirement: true,
						completed: this.props.result,
						incomplete: !this.props.result,
					})
				},
				this.props.details.has, ' of ', this.props.details.needs
			),
			React.createElement('ul', {className: 'requirement-detail-list'},
				_.map(this.props.details.matches, (match) => {
					return React.createElement('li', {key: match.clbid, className: 'match'}, match.deptnum)
				})
			)
		)
	}
})

var RequirementSet = React.createClass({
	render() {
		// console.log('requirement-set render', this.props)

		var details;
		var type = this.props.type

		if (type === 'array/requirementSet') {
			details = _.map(this.props.details, (requirement, index) => {
				return React.createElement(RequirementSet, _.merge({key: index}, requirement))
			})
		}

		else if (type === 'array/some') {
			details = React.createElement(SomeArrayRequirement, {details: this.props.details})
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

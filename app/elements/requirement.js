import * as _ from 'lodash'
import * as React from 'react/addons'
let cx = React.addons.classSet

let BooleanRequirement = React.createClass({
	propTypes: {
		result: React.PropTypes.bool.isRequired,
	},
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-boolean'},
			React.createElement('span',
				{
					className: cx({
						requirement: true,
						completed: this.props.result,
						incomplete: !this.props.result,
					})
				},
				this.props.result ? 'Completed' : 'Incomplete')
		)
	}
})

let SomeArrayRequirement = React.createClass({
	propTypes: {
		result: React.PropTypes.bool.isRequired,
		details: React.PropTypes.shape({
			has: React.PropTypes.number.isRequired,
			needs: React.PropTypes.oneOfType([
				React.PropTypes.number,
				React.PropTypes.string,
			]).isRequired,
			word: React.PropTypes.string,
			from: React.PropTypes.arrayOf(React.PropTypes.shape({
				title: React.PropTypes.string.isRequired,
				result: React.PropTypes.bool.isRequired,
				abbr: React.PropTypes.string,
			})).isRequired,
		})
	},
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-some-array'},
			(this.props.details.has || this.props.details.needs || this.props.details.word) ?
				React.createElement('span',
					{
						className: cx({
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
							className: cx({
								requirement: true,
								completed: req.result,
								nope: !req.result,
							}),
						},
						(req.abbr || req.title)
					)
				})
			)
		)
	},
})

let BooleanArrayRequirement = React.createClass({
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
							className: cx({
								requirement: true,
								completed: req.result,
								incomplete: !req.result,
							}),
						},
						(req.abbr || req.title)
					)
				})
			)
		)
	}
})

let NumberObjectRequirement = React.createClass({
	render() {
		return React.createElement('div',
			{className: 'requirement-result requirement-result-object-number'},
			React.createElement('span',
				{
					className: cx({
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

export {
	BooleanRequirement,
	SomeArrayRequirement,
	BooleanArrayRequirement,
	NumberObjectRequirement
}

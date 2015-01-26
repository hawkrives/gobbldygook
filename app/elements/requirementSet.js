import _ from 'lodash'
import React from 'react'
import marked from 'marked'

import {
	BooleanRequirement, SomeArrayRequirement, BooleanArrayRequirement, NumberObjectRequirement
} from './requirement'

let RequirementSet = React.createClass({
	propTypes: {
		description: React.PropTypes.string,
		result: React.PropTypes.bool.isRequired,
		title: React.PropTypes.string.isRequired,
		type: React.PropTypes.string.isRequired,
		details: React.PropTypes.oneOfType([
			React.PropTypes.object, // for the sub-types
			React.PropTypes.array,  // otherwise it's an array of reqsets
		]),
	},

	toggleDescription() {
		this.setState({showDescription: !this.state.showDescription})
	},

	getInitialState() {
		return {
			showDescription: false
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.description)
			this.setState({descriptionHTML: marked(nextProps.description)})
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	render() {
		// console.log('requirement-set render', this.props)

		let title = React.createElement('h2', {
			className: this.props.result ? 'completed' : 'incomplete',
			title: this.props.description,
		}, this.props.title)

		let description = null
		if (this.state.showDescription && this.state.descriptionHTML)
			description = React.createElement('div', {className: 'description', dangerouslySetInnerHTML: {__html: this.state.descriptionHTML}})

		let titlebar = React.createElement('header', {onClick: this.toggleDescription}, title, description)

		let details = null

		if (this.props.type === 'array/requirementSet') {
			details = _.map(this.props.details, (requirement, index) => {
				return React.createElement(RequirementSet, _.merge({key: index}, requirement))
			})
		}

		else if (this.props.type === 'array/some') {
			details = React.createElement(SomeArrayRequirement, {result: this.props.result, details: this.props.details})
		}

		else if (this.props.type === 'array/boolean') {
			details = React.createElement(BooleanArrayRequirement, {details: this.props.details})
		}

		else if (this.props.type === 'boolean') {
			details = React.createElement(BooleanRequirement, {result: this.props.result})
		}

		else if (this.props.type === 'object/number') {
			details = React.createElement(NumberObjectRequirement, {result: this.props.result, details: this.props.details})
		}

		return React.createElement('div', {className: 'requirement-set', 'data-type': this.props.type},
			titlebar,
			details)
	},
})

export default RequirementSet

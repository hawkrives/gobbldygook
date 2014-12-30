import * as _ from 'lodash'
import * as React from 'react'
import * as marked from 'marked'

import {
	BooleanRequirement, SomeArrayRequirement, BooleanArrayRequirement, NumberObjectRequirement
} from '../elements/requirement'

let RequirementSet = React.createClass({
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

		let description = null;
		if (this.state.showDescription && this.state.descriptionHTML)
			description = React.createElement('div', {className: 'description', dangerouslySetInnerHTML: {__html: this.state.descriptionHTML}})

		let titlebar = React.createElement('header', {onClick: this.toggleDescription}, title, description)

		let details;
		let type = this.props.type

		if (type === 'array/requirementSet') {
			details = _.map(this.props.details, (requirement, index) => {
				return React.createElement(RequirementSet, _.merge({key: index}, requirement))
			})
		}

		else if (type === 'array/some') {
			details = React.createElement(SomeArrayRequirement, {result: this.props.result, details: this.props.details})
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
			titlebar,
			details)
	},
})

export default RequirementSet

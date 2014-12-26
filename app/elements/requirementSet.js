import * as _ from 'lodash'
import * as React from 'react'

import {
	BooleanRequirement, SomeArrayRequirement, BooleanArrayRequirement, NumberObjectRequirement
} from 'elements/requirement'

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
	},
})

export default RequirementSet

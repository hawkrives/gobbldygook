import map from 'lodash/collection/map'
import extend from 'lodash/object/extend'
import React from 'react'
import marked from 'marked'

import BooleanRequirement from './booleanRequirement'
import SomeArrayRequirement from './someArrayRequirement'
import BooleanArrayRequirement from './booleanArrayRequirement'
import NumberObjectRequirement from './numberObjectRequirement'

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
		if (nextProps.description) {
			this.setState({descriptionHTML: marked(nextProps.description)})
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	render() {
		console.log('RequirementSet#render')
		// console.log('requirement-set render', this.props)

		let title = <h2
			className={this.props.result ? 'completed' : 'incomplete'}
			title={this.props.description}> {this.props.title} </h2>

		let description = null
		if (this.state.showDescription && this.state.descriptionHTML) {
			description = <div className='description' dangerouslySetInnerHTML={{__html: this.state.descriptionHTML}} />
		}

		let titlebar = <header onClick={this.toggleDescription}>{title}{description}</header>

		let details = null

		if (this.props.type === 'array/requirementSet') {
			details = map(this.props.details, (requirement, index) =>
				<RequirementSet key={index} {...requirement} />)
		}

		else if (this.props.type === 'array/some') {
			details = <SomeArrayRequirement
				result={this.props.result}
				details={this.props.details} />
		}

		else if (this.props.type === 'array/boolean') {
			details = <BooleanArrayRequirement details={this.props.details} />
		}

		else if (this.props.type === 'boolean') {
			details = <BooleanRequirement result={this.props.result} />
		}

		else if (this.props.type === 'object/number') {
			details = <NumberObjectRequirement
				result={this.props.result}
				details={this.props.details} />
		}

		return <div className='requirement-set' data-type={this.props.type}>
			{titlebar}
			{details}
		</div>
	},
})

export default RequirementSet

import React from 'react'
import cx from 'classnames'

let BooleanRequirement = React.createClass({
	propTypes: {
		result: React.PropTypes.bool.isRequired,
	},
	render() {
		let requirementClasses = cx({
			requirement: true,
			completed: this.props.result,
			incomplete: !this.props.result,
		})

		return <div className='requirement-result requirement-result-boolean'>
			<span className={requirementClasses}>
				{this.props.result ? 'Completed' : 'Incomplete'}
			</span>
		</div>
	},
})

export default BooleanRequirement

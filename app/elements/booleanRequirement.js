import React from 'react'
import cx from 'classnames'

class BooleanRequirement extends React.Component {
	render() {
		console.log('BooleanRequirement#render')
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
	}
}

BooleanRequirement.propTypes = {
	result: React.PropTypes.bool.isRequired,
}

export default BooleanRequirement

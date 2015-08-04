import React, {Component, PropTypes} from 'react'

export default class CourseIdentBlock extends Component {
	static propTypes = {
		dept: PropTypes.string.isRequired,
		num: PropTypes.number.isRequired,
		section: PropTypes.string,
	}

	render() {
		return (
			<span className='identifier'>
				{this.props.dept} {this.props.num}{this.props.section || ''}
			</span>
		)
	}
}

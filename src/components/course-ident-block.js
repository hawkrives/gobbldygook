import React from 'react'

export default class CourseIdentBlock extends React.Component {
	static propTypes = {
		dept: React.PropTypes.string.isRequired,
		num: React.PropTypes.number.isRequired,
		section: React.PropTypes.string,
	}

	shouldComponentUpdate(nextProps) {
		return (
			this.props.dept !== nextProps.dept &&
			this.props.num !== nextProps.num &&
			this.props.section !== nextProps.section
		)
	}

	render() {
		return (<span className='identifier'>
			{this.props.dept} {this.props.num}{this.props.section || ''}
		</span>)
	}
}

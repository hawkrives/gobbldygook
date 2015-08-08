import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class CourseExpression extends Component {
	static propTypes = {
		_result: PropTypes.bool,
		department: PropTypes.arrayOf(PropTypes.string).isRequired,
		international: PropTypes.bool,
		lab: PropTypes.bool,
		level: PropTypes.number,
		number: PropTypes.number,
		section: PropTypes.string,
		semester: PropTypes.number,
		style: PropTypes.object,
		year: PropTypes.number,
	}

	render() {
		const department = this.props.department.join('/')

		const international = this.props.international
			? <span className='course--international'>I</span>
			: null
		const lab = this.props.lab
			? <span className='course--lab'>L</span>
			: null

		const section = this.props.section
			? <span className='course--section'>[{this.props.section}]</span>
			: null

		const year = this.props.year
			? <span className='course--year'>{this.props.year}</span>
			: null
		const semester = this.props.semester
			? <span className='course--semester'>S{this.props.semester}</span>
			: null

		/////

		const temporalIdentifiers = (semester || year)
			? (<div className='temporal'>
				{semester}
				{year}
			</div>)
			: null

		return (
			<span className={cx('course', {matched: this.props._result})} style={this.props.style}>
				<div className='basic-identifiers'>
					<span className='course--department'>{department}</span>
					<span>
						<span className='course--number'>{this.props.number || String(this.props.level)[0] + 'XX'}</span>
						{international}
						{lab}
						{' '}
						{section}
					</span>
				</div>
				{temporalIdentifiers}
			</span>
		)
	}
}

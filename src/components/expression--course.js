import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import includes from 'lodash/collection/includes'

import './expression--course.scss'

function hasOwnKey(course, key) {
	// In order to have an "own key":
	// 1. the course MUST have the key on its object
	// 2. the key MUST NOT appear in the _extraKeys array
	//      (which may or may not exist)
	return (
		course.hasOwnProperty(key) &&
		!includes(course._extraKeys || [], key)
	)
}

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

		const international = hasOwnKey(this.props, 'international') &&
			<span className='course--international'>I</span>
		const lab = hasOwnKey(this.props, 'lab') &&
			<span className='course--lab'>L</span>

		const section = hasOwnKey(this.props, 'section') &&
			<span className='course--section'>[{this.props.section}]</span>

		const year = hasOwnKey(this.props, 'year') &&
			<span className='course--year'>{this.props.year}</span>
		const semester = hasOwnKey(this.props, 'semester') &&
			<span className='course--semester'>S{this.props.semester}</span>

		/////

		const temporalIdentifiers = (semester || year) &&
			(<div className='temporal'>
				{semester}
				{year}
			</div>)

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

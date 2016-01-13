import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import semesterName from '../helpers/semester-name'
import {shrinkDept} from '../area-tools/convert-department'
import map from 'lodash/collection/map'

import './expression--course.scss'

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
	};

	render() {
		const department = map(this.props.department, shrinkDept).join('/')

		const international = this.props.international &&
			<span className='course--international'>I</span>
		const lab = this.props.lab &&
			<span className='course--lab'>L</span>

		const section = this.props.section && this.props.section !== '*' &&
			<span className='course--section'>[{this.props.section}]</span>

		const year = this.props.year &&
			<span className='course--year'>{this.props.year}</span>
		const semester = this.props.semester &&
			<span className='course--semester'>
				{this.props.semester === '*'
					? 'ANY'
					: semesterName(this.props.semester).toUpperCase()}
			</span>

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
						{lab ? 'L' : null}
						{' '}
						{section}
					</span>
				</div>
				{temporalIdentifiers}
			</span>
		)
	}
}

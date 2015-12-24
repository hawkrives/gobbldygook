import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import semesterName from '../helpers/semester-name'

import './expression--course.scss'

function shrinkDept(dept, index, collection) {
	if (collection.length === 1) {
		return dept
	}

	if (dept === 'ASIAN') {
		return 'AS'
	}
	if (dept === 'ART') {
		return 'AR'
	}
	else if (dept === 'REL') {
		return 'RE'
	}
	else if (dept === 'PSCI') {
		return 'PS'
	}
	else if (dept === 'PHIL') {
		return 'PH'
	}
	else if (dept === 'HIST') {
		return 'HI'
	}
	else if (dept === 'ENVST') {
		return 'ES'
	}
	else if (dept === 'SOAN') {
		return 'SA'
	}

	return dept
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
		const department = this.props.department.map(shrinkDept).join('/')

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

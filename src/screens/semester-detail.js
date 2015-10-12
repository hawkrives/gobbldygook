import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'
import DocumentTitle from 'react-document-title'
import isCurrentSemester from '../helpers/is-current-semester'
import semesterName from '../helpers/semester-name'

import Student from '../models/student'

import './semester-detail.scss'

export default class SemesterDetail extends Component {
	static propTypes = {
		className: PropTypes.string,
		location: PropTypes.shape({
			pathname: PropTypes.string,
			search: PropTypes.string,
		}).isRequired, // from react-router
		student: PropTypes.instanceOf(Student).isRequired,
	}

	constructor() {
		super()
		this.state = {
			year: null,
			semester: null,
			schedules: Immutable.List(),
		}
	}

	render() {
		// console.log('SemesterDetail#render')
		const {year, semester} = this.getParams()
		const schedules = this.props.student.schedules
			.filter(isCurrentSemester(year, semester))
			.map(sched => sched.toMap())
			.map(sched => sched.delete('_courseData'))
			.toJS()

		return (
			<DocumentTitle title={`${semesterName(semester)} ${year} • ${this.props.student.name} | Gobbldygook`}>
				<div className={cx('semester-detail', this.props.className)}>
					<pre>
						{`${this.props.location.pathname}${this.props.location.search}\n`}
						{JSON.stringify(schedules, null, 2)}
					</pre>
				</div>
			</DocumentTitle>
		)
	}
}

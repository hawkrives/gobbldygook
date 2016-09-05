import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import map from 'lodash/map'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import DocumentTitle from 'react-document-title'
import {isCurrentSemester} from 'gb-school-stolaf'
import {semesterName} from 'gb-school-stolaf'

import './semester-detail.scss'

// eslint-disable-next-line react/prefer-stateless-function
export default class SemesterDetail extends Component {
	static propTypes = {
		className: PropTypes.string,
		location: PropTypes.shape({ // react-router
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
		params: PropTypes.object, // react-router
		student: PropTypes.object,
	};

	constructor() {
		super()
		this.state = {
			year: null,
			semester: null,
			schedules: [],
		}
	}

	render() {
		// console.log('SemesterDetail#render')
		const {year, semester} = this.props.params
		const student = this.props.student.data.present

		const schedules = map(
			filter(student.schedules, isCurrentSemester(year, semester)),
			sched => omit(sched, 'courses'))

		return (
			<DocumentTitle title={`${semesterName(semester)} ${year} • ${student.name} | Gobbldygook`}>
				<div className={cx('semester-detail', this.props.className)}>
					<pre>
						{this.props.location.pathname}{'\n'}
						{JSON.stringify(schedules, null, 2)}
					</pre>
				</div>
			</DocumentTitle>
		)
	}
}

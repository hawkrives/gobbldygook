import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import omit from 'lodash/object/omit'
import DocumentTitle from 'react-document-title'
import isCurrentSemester from '../../../helpers/is-current-semester'
import semesterName from '../../../helpers/semester-name'

import './semester-detail.scss'

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
		const {student} = this.props

		const schedules = map(
			filter(student.schedules, isCurrentSemester(year, semester)),
			sched => omit(sched, 'courses'))

		return (
			<DocumentTitle title={`${semesterName(semester)} ${year} • ${student.name} | Gobbldygook`}>
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

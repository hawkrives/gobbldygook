import React, {PropTypes} from 'react'
import cx from 'classnames'
import {State} from 'react-router'
import Immutable from 'immutable'
import {isCurrentSemester} from 'sto-helpers'

import Student from '../models/student'

let SemesterDetail = React.createClass({
	propTypes: {
		className: PropTypes.string,
		student: PropTypes.instanceOf(Student).isRequired,
	},

	mixins: [State],

	getInitialState() {
		return {
			year: null,
			semester: null,
			schedules: Immutable.List(),
		}
	},

	render() {
		// console.log('SemesterDetail#render')
		const {year, semester} = this.getParams()
		const schedules = this.props.student.schedules
			.filter(isCurrentSemester(year, semester))
			.toJS()

		return (
			<div className={cx('semester-detail', this.props.className)}>
				<pre>
					{this.getPath()}{'\n'}
					{JSON.stringify(schedules, null, 2)}
				</pre>
			</div>
		)
	},
})

export default SemesterDetail

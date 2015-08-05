import React, {PropTypes} from 'react'
import cx from 'classnames'
import {State} from 'react-router'
import Immutable from 'immutable'
import {isCurrentSemester} from 'sto-helpers'
import DocumentTitle from 'react-document-title'
import {semesterName} from 'sto-helpers'

let SemesterDetail = React.createClass({
	propTypes: {
		className: PropTypes.string,
		student: PropTypes.object.isRequired,
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
			<DocumentTitle title={`${semesterName(semester)} ${year} • ${this.props.student.name} | Gobbldygook`}>
				<div className={cx('semester-detail', this.props.className)}>
					<pre>
						{this.getPath()}{'\n'}
						{JSON.stringify(schedules, null, 2)}
					</pre>
				</div>
			</DocumentTitle>
		)
	},
})

export default SemesterDetail

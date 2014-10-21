'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import CourseList from './courseList'

var isCurrentTermSchedule = _.curry(function(year, semester, schedule) {
	return (schedule.year === year && schedule.semester === semester)
})

let semesterName = (semester) => {
	let semesters = {
		1: 'Fall',
		2: 'Interim',
		3: 'Spring',
		4: 'Early Summer',
		5: 'Late Summer',
	}
	return semesters[semester] || 'Unknown (' + semester + ')'
}

var Semester = React.createClass({
	removeSemester() {
		var currentTermSchedules = _.filter(this.props.schedules,
			isCurrentTermSchedule(this.props.year, this.props.semester))

		var scheduleIds = _.pluck(currentTermSchedules, 'id')

		this.props.schedules.destroyMultiple(scheduleIds)
	},
	render() {
		let schedule = _.find(this.props.schedules.activeSchedules,
			{year: this.props.year, semester: this.props.semester})

		let courseCount = _.size(schedule.courses)

		return React.DOM.div({className: 'semester' + (schedule.isValid ? '' : ' invalid')},
			React.DOM.header({className: 'semester-title'},
				React.DOM.h1(null, semesterName(this.props.semester)),
				React.DOM.ul({className: 'info-bar'},
					React.DOM.li(
						{className: 'semester-course-count'},
						courseCount + ' ' + humanize.pluralize(courseCount, 'course')
					),
					schedule.isValid ? null :
						React.DOM.li({
							className: 'semester-status',
							title: JSON.stringify(schedule.conflicts, null, 2)},
							React.DOM.i({className: 'ion-alert-circled'}))
				),
				React.DOM.button({
					className: 'remove-semester',
					title: 'Remove ' + String(this.props.year) + ' ' + semesterName(this.props.semester),
					onClick: this.removeSemester,
				})
			),
			CourseList({courses: schedule.courses})
		)
	}
})

export default Semester

'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import semesterName from '../helpers/semesterName'
import Course from './course'

import {DragDropMixin} from '../../node_modules/react-dnd/dist/ReactDND.min'
import itemTypes from '../objects/itemTypes'

var isCurrentTermSchedule = _.curry(function(year, semester, schedule) {
	return (schedule.year === year && schedule.semester === semester)
})

var Semester = React.createClass({
	mixins: [DragDropMixin],
	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dropTarget: {
				acceptDrop(courseIdentifier) {
					console.log('dropped courseIdentifier', courseIdentifier)
					this.schedule.addCourse(courseIdentifier.clbid)
				}
			}
		})
	},
	removeSemester() {
		var currentTermSchedules = _.filter(this.props.schedules,
			isCurrentTermSchedule(this.props.year, this.props.semester))

		var scheduleIds = _.pluck(currentTermSchedules, 'id')

		this.props.schedules.destroyMultiple(scheduleIds)
	},
	render() {
		let activeSchedules = this.props.schedules.activeSchedules
		this.schedule = _.find(activeSchedules,
				{year: this.props.year, semester: this.props.semester})
		let schedule = this.schedule;
		// console.log('semester render', schedule)

		let infoBar = null;
		if (schedule) {
			let courseCount = _.size(schedule.courses)
			infoBar = React.DOM.ul({className: 'info-bar'},
				React.DOM.li(
					{className: 'semester-course-count'},
					courseCount + ' ' + humanize.pluralize(courseCount, 'course')
				),
				schedule.isValid ? null :
					React.DOM.li({
						className: 'semester-status',
						title: JSON.stringify(schedule.conflicts, null, 2)},
						React.DOM.i({className: 'ion-alert-circled'})));
		}

		let courseList = null;
		if (schedule) {
			courseList = React.DOM.div({className: 'course-list'},
				_.map(schedule.courses,
					course => Course({
						key: course.clbid,
						info: course,
						schedule: schedule,
						semesters: activeSchedules
					})));
		}

		return React.DOM.div(
			Object.assign(
				{className: 'semester' + ((schedule && schedule.isValid) ? '' : ' invalid')},
				this.dropTargetFor(itemTypes.COURSE)),
			React.DOM.header({className: 'semester-title'},
				React.DOM.h1(null, semesterName(this.props.semester)),
				infoBar,
				React.DOM.button({
					className: 'remove-semester',
					title: 'Remove ' + String(this.props.year) + ' ' + semesterName(this.props.semester),
					onClick: this.removeSemester,
				})),
			courseList);
	}
})

export default Semester

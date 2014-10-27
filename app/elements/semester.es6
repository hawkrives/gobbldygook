'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import add from '../helpers/add'
import semesterName from '../helpers/semesterName'
import Course from './course'
import {EmptyCourseSlot} from './course'

import {DragDropMixin} from '../../node_modules/react-dnd/dist/ReactDND.min'
import itemTypes from '../models/itemTypes'

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

		let infoIcons = []
		if (schedule) {
			let courseCount = _.size(schedule.courses)
			infoIcons.push(React.DOM.li({
				className: 'semester-course-count', key: 'course-count'},
				courseCount + ' ' + humanize.pluralize(courseCount, 'course')))

			if (!schedule.isValid) {
				let conflicts = JSON.stringify(schedule.conflicts, null, 2)
				infoIcons.push(React.DOM.li({
					className: 'semester-status',
					key: 'semester-status',
					title: conflicts},
					React.DOM.i({className: 'ion-alert-circled'})))
			}

			let credits = _.reduce(_.pluck(schedule.courses, 'credits'), add) || 0
			if (credits) {
				infoIcons.push(React.DOM.li({
					className: 'semester-credit-count', key: 'credit-count'},
					credits + ' ' + humanize.pluralize(credits, 'credit')))
			}
		}
		let infoBar = React.DOM.ul({className: 'info-bar'}, infoIcons);

		let courseList = null;
		if (schedule) {
			let courseObjects = _.map(schedule.courses,
				(course, i) => Course({
					key: course.clbid,
					info: course,
					schedule: schedule,
					semesters: activeSchedules,
					index: i,
					conflicts: schedule.conflicts,
				}))
			if ((schedule.semester === 1 || schedule.semester === 3) && courseObjects.length < 4) {
				_(_.range(courseObjects.length+1, 4+1)).each((i) => courseObjects.push(EmptyCourseSlot({
					key: 'empty'+i,
					index: i
				})))
			}
			courseList = React.DOM.div({className: 'course-list'}, courseObjects);
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

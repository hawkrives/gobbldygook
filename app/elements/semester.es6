'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import add from '../helpers/add.es6'
import countCredits from '../helpers/countCredits.es6'
import semesterName from '../helpers/semesterName.es6'
import Course from './course.es6'
import {EmptyCourseSlot} from './course.es6'

import {DragDropMixin} from 'react-dnd'
import itemTypes from '../models/itemTypes.es6'

var isCurrentTermSchedule = _.curry((year, semester, schedule) => {
	return (schedule.year === year && schedule.semester === semester)
})

var Semester = React.createClass({
	displayName: 'Semester',
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
			infoIcons.push(React.createElement('li', {
				className: 'semester-course-count', key: 'course-count'},
				courseCount + ' ' + humanize.pluralize(courseCount, 'course')))

			if (!schedule.isValid) {
				let conflicts = JSON.stringify(schedule.conflicts, null, 2)
				infoIcons.push(React.createElement('li', {
					className: 'semester-status',
					key: 'semester-status',
					title: conflicts},
					React.createElement('i', {className: 'ion-alert-circled'})))
			}

			let credits = _.reduce(_.pluck(schedule.courses, 'credits'), add) || 0
			if (credits) {
				infoIcons.push(React.createElement('li', {
					className: 'semester-credit-count', key: 'credit-count'},
					credits + ' ' + humanize.pluralize(credits, 'credit')))
			}
		}
		let infoBar = React.createElement('ul', {className: 'info-bar'}, infoIcons);

		let courseList = null;
		if (schedule) {
			let courses = schedule.courses;
			let courseObjects = _.map(courses,
				(course, i) => React.createElement(Course, {
					key: course.clbid,
					info: course,
					schedule: schedule,
					semesters: activeSchedules,
					index: i,
					conflicts: schedule.conflicts,
				}))
			let maxCredits = (schedule.semester === 1 || schedule.semester === 3) ? 4 : 1;
			_.each(_.range(Math.floor(countCredits(courses)), maxCredits), (i) => courseObjects.push(
				React.createElement(EmptyCourseSlot, {key: 'empty'+i})
			))
			courseList = React.createElement('div', {className: 'course-list'}, courseObjects);
		}

		return React.createElement('div',
			Object.assign(
				{className: 'semester' + ((schedule && schedule.isValid) ? '' : ' invalid')},
				this.dropTargetFor(itemTypes.COURSE)),
			React.createElement('header', {className: 'semester-title'},
				React.createElement('h1', null, semesterName(this.props.semester)),
				infoBar,
				React.createElement('button', {
					className: 'remove-semester',
					title: 'Remove ' + String(this.props.year) + ' ' + semesterName(this.props.semester),
					onClick: this.removeSemester,
				})),
			courseList);
	}
})

export default Semester

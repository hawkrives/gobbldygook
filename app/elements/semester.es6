'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
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
					this.state.schedule.addCourse(courseIdentifier.clbid)
				}
			}
		})
	},

	getInitialState() {
		return {
			courses: [],
			schedule: {},
			validation: {},
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.semester === 2 && nextProps.year === 2012)
			console.log('called componentWillReceiveProps')
		let schedule = _.find(nextProps.schedules.activeSchedules,
				{year: nextProps.year, semester: nextProps.semester})

		Promise.all([schedule.courses, schedule.validate()]).then((results) => {
			let [courses, validation] = results;
			if (nextProps.semester === 2 && nextProps.year === 2012)
				console.log('next courses', courses)
			this.setState({
				schedule,
				courses,
				validation,
			})
		})
	},

	removeSemester() {
		var currentTermSchedules = _.filter(this.props.schedules.data,
			isCurrentTermSchedule(this.props.year, this.props.semester))

		var scheduleIds = _.pluck(currentTermSchedules, 'id')

		this.props.schedules.destroyMultiple(scheduleIds)
	},

	render() {
		// console.log('semester render', schedule)

		let infoIcons = []
		if (this.state.schedule) {
			let courseCount = _.size(this.state.courses)
			infoIcons.push(React.createElement('li', {
				className: 'semester-course-count', key: 'course-count'},
				courseCount + ' ' + humanize.pluralize(courseCount, 'course')))

			if (this.state.validation.hasConflict) {
				let conflicts = JSON.stringify(this.state.validation.conflicts, null, 2)
				infoIcons.push(React.createElement('li', {
					className: 'semester-status',
					key: 'semester-status',
					title: conflicts},
					React.createElement('i', {className: 'semester-alert'})))
			}

			let credits = _(this.state.courses).pluck('credits').reduce(add)
			if (credits) {
				infoIcons.push(React.createElement('li', {
					className: 'semester-credit-count', key: 'credit-count'},
					credits + ' ' + humanize.pluralize(credits, 'credit')))
			}
		}
		let infoBar = React.createElement('ul', {className: 'info-bar'}, infoIcons);

		let courseList = null;
		if (this.state.schedule) {
			let courseObjects = _.map(this.state.courses,
				(course, i) => React.createElement(Course, {
					key: course.clbid,
					info: course,
					schedule: this.state.schedule,
					index: i,
					conflicts: this.state.validation.conflicts,
				}))
			let semester = this.props.semester
			let maxCredits = (semester === 1 || semester === 3) ? 4 : 1
			_.each(_.range(Math.floor(countCredits(this.state.courses)), maxCredits), (i) => courseObjects.push(
				React.createElement(EmptyCourseSlot, {key: 'empty' + i})
			))
			courseList = React.createElement('div', {className: 'course-list'}, courseObjects);
		}

		return React.createElement('div',
			Object.assign(
				{className: 'semester'},
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

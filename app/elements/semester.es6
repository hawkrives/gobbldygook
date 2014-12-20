import * as _ from 'lodash'
import * as Promise from 'bluebird'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import add from 'helpers/add'
import countCredits from 'helpers/countCredits'
import semesterName from 'helpers/semesterName'
import Course from 'elements/course'
import {EmptyCourseSlot} from 'elements/course'

import studentActions from 'flux/studentActions'
import {DragDropMixin} from 'react-dnd'
import itemTypes from 'models/itemTypes'

var Semester = React.createClass({
	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dropTarget: {
				acceptDrop(courseIdentifier) {
					console.log('dropped courseIdentifier', courseIdentifier)
					studentActions.addCourse(this.props.student.id, this.schedule.id, courseIdentifier.clbid)
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
		let activeSchedules = nextProps.student.activeSchedules
		let schedule = activeSchedules.find((s) => s.year === this.props.year && s.semester === this.props.semester)

		Promise.all([schedule.courses, schedule.validate()]).then((results) => {
			let [courses, validation] = results;
			this.setState({
				schedule,
				courses,
				validation,
			})
		})
	},

	removeSemester() {
		var currentTermSchedules = this.props.student.schedules.filter((s) =>
			s.year === this.props.year && s.semester === this.props.semester)

		var scheduleIds = currentTermSchedules.map((s) => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	render() {
		// console.log('semester render', schedule)

		let infoIcons = []
		if (this.state.schedule) {
			let courseCount = schedule.courses.size
			infoIcons.push(React.createElement('li',
				{className: 'semester-course-count', key: 'course-count'},
				courseCount + ' ' + humanize.pluralize(courseCount, 'course')))

			if (this.state.validation.hasConflict) {
				let conflicts = JSON.stringify(this.state.validation.conflicts, null, 2)
				infoIcons.push(React.createElement('li',
					{
						className: 'semester-status',
						key: 'semester-status',
						title: conflicts,
					},
					React.createElement('i', {className: 'semester-alert'})))
			}

			let credits = this.state.schedule.courses.map((c) => c.credits).reduce(add, 0)

			if (credits) {
				infoIcons.push(React.createElement('li',
					{className: 'semester-credit-count', key: 'credit-count'},
					credits + ' ' + humanize.pluralize(credits, 'credit')))
			}
		}
		let infoBar = React.createElement('ul', {className: 'info-bar'}, infoIcons);

		let courseList = null;
		if (this.state.schedule) {
			let courseObjects = this.state.courses.map((course, i) =>
				React.createElement(Course, {
					key: course.clbid,
					info: course,
					schedule: this.state.schedule,
					index: i,
					conflicts: this.state.validation.conflicts,
				}))

			let semester = this.props.semester
			let maxCredits = (semester === 1 || semester === 3) ? 4 : 1
			Immutable.Range(Math.floor(countCredits(courses)), maxCredits).forEach((i) => {
				courseObjects = courseObjects.push(React.createElement(EmptyCourseSlot, {key: 'empty' + i}))
			})
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
					title: `Remove ${this.props.year} ${semesterName(this.props.semester)}`,
					onClick: this.removeSemester,
				})),
			courseList);
	},
})

export default Semester

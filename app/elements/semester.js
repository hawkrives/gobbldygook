import * as _ from 'lodash'
import {isUndefined} from 'lodash'
import * as Promise from 'bluebird'
import * as React from 'react'
import * as humanize from 'humanize-plus'
import * as Immutable from 'immutable'

import add from 'helpers/add'
import countCredits from 'helpers/countCredits'
import semesterName from 'helpers/semesterName'
import {Course, MissingCourse, EmptyCourseSlot} from 'elements/course'

import studentActions from 'flux/studentActions'
import {DragDropMixin} from 'react-dnd'
import itemTypes from 'models/itemTypes'

let Semester = React.createClass({
	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dropTarget: {
				acceptDrop(courseIdentifier) {
					console.log('dropped courseIdentifier', courseIdentifier)
					studentActions.addCourse(this.props.student.id, this.state.schedule.id, courseIdentifier.clbid)
				}
			}
		})
	},

	getInitialState() {
		return {
			courses: Immutable.List(),
			schedule: null,
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
				courses: Immutable.List(courses),
				validation,
			})
		})
	},

	removeSemester() {
		let currentTermSchedules = this.props.student.schedules.filter((s) =>
			s.year === this.props.year && s.semester === this.props.semester)

		let scheduleIds = currentTermSchedules.map((s) => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	render() {
		// console.log('semester render', schedule)

		let infoIcons = []
		if (this.state.schedule) {
			let courseCount = this.state.courses.size
			infoIcons.push(React.createElement('li',
				{className: 'semester-course-count', key: 'course-count'},
				`${courseCount} ${humanize.pluralize(courseCount, 'course')}`))

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

			let credits = this.state.courses
				.filterNot(isUndefined) // remove any undefined items
				.map(c => c.credits)
				.reduce(add)

			if (credits) {
				infoIcons.push(React.createElement('li',
					{className: 'semester-credit-count', key: 'credit-count'},
					`${credits} ${humanize.pluralize(credits, 'credit')}`))
			}
		}
		let infoBar = React.createElement('ul', {className: 'info-bar'}, infoIcons);

		let courseList = null;
		if (this.state.schedule) {
			let courseObjects = this.state.courses
				.filterNot(isUndefined)
				.map((course, i) =>
					React.createElement(Course, {
						key: `${course.clbid}-${i}`,
						info: course,
						schedule: this.state.schedule,
						index: i,
						conflicts: this.state.validation.conflicts,
					}))

			let couldntFindSlots = this.state.courses
				.filter(isUndefined) // only keep the undefined items
				.map((c, i) => React.createElement(MissingCourse, {key: i}))

			// maxCredits is 4 for fall/spring and 1 for everything else
			let maxCredits = ([1, 3].indexOf(this.props.semester) !== -1) ? 4 : 1
			let emptySlotList = Immutable.Range(Math.floor(countCredits(this.state.courses)), maxCredits)
			let emptySlots = emptySlotList
				.skip(couldntFindSlots.size)
				.map((i) => React.createElement(EmptyCourseSlot, {key: `empty-${i}`}))

			let courseBlocks = courseObjects
				.concat(couldntFindSlots)
				.concat(emptySlots)
				.toJS()

			courseList = React.createElement('div',
				{className: 'course-list'},
				courseBlocks)
		}

		return React.createElement('div',
			_.extend({className: 'semester'}, this.dropTargetFor(itemTypes.COURSE)),
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

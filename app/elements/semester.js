import {isUndefined, extend} from 'lodash'
import {DragDropMixin} from 'react-dnd'
import Promise from 'bluebird'
import React from 'react/addons'
import {Link} from 'react-router'
import humanize from 'humanize-plus'
import Immutable from 'immutable'

import add from 'app/helpers/add'
import countCredits from 'app/helpers/countCredits'
import semesterName from 'app/helpers/semesterName'
import {isCurrentSemester} from 'app/helpers/isCurrent'
import {Course, MissingCourse, EmptyCourseSlot} from 'app/elements/course'
import studentActions from 'app/flux/studentActions'
import itemTypes from 'app/models/itemTypes'

let cx = React.addons.classSet

let Semester = React.createClass({
	mixins: [DragDropMixin],

	propTypes: {
		student: React.PropTypes.object.isRequired,
		year: React.PropTypes.number.isRequired,
		semester: React.PropTypes.number.isRequired,
	},

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

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let activeSchedules = nextProps.student.activeSchedules
		let schedule = activeSchedules.find((s) => s.year === this.props.year && s.semester === this.props.semester)

		Promise.all([schedule.courses, schedule.validate()]).then((results) => {
			let [courses, validation] = results
			this.setState({
				schedule,
				courses: Immutable.List(courses),
				validation,
			})
		})
	},

	getInitialState() {
		return {
			courses: Immutable.List(),
			schedule: null,
			validation: {},
		}
	},

	render() {
		// console.log('semester render', this.state.schedule)

		let infoIcons = []
		if (this.state.schedule && this.state.courses.size) {
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
		let infoBar = React.createElement('ul', {className: 'info-bar'}, infoIcons)

		let courseList = null
		if (this.state.schedule && this.state.courses) {
			let courseObjects = this.state.courses
				.filterNot(isUndefined)
				.map((course, i) =>
					React.createElement(Course, {
						key: `${course.clbid}-${i}`,
						info: course,
						student: this.props.student,
						schedule: this.state.schedule,
						index: i,
						conflicts: this.state.validation.conflicts,
					}))

			let couldntFindSlots = this.state.courses
				.filter(isUndefined) // only keep the undefined items
				.map((c, i) => React.createElement(MissingCourse, {key: i}))

			// maxCredits is 4 for fall/spring and 1 for everything else
			let maxCredits = ([1, 3].indexOf(this.props.semester) !== -1) ? 4 : 1
			let emptySlotList = Immutable.Range(Math.floor(countCredits(this.state.courses.toArray())), maxCredits)
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
		else if (this.state.schedule) {
			courseList = React.createElement('div', {className: 'loading'}, 'Loading Courses')
		}

		let droppableIsMoving = this.getDropState(itemTypes.COURSE).isDragging
		let droppableIsOver = this.getDropState(itemTypes.COURSE).isHovering

		let semesterProps = {
			className: cx({
				semester: true,
				'can-drop': droppableIsMoving,
				'is-over': droppableIsOver,
			})
		}

		return React.createElement('div',
			extend(semesterProps, this.dropTargetFor(itemTypes.COURSE)),
			React.createElement('header', {className: 'semester-title'},
				React.createElement('h1', null, React.createElement(Link,
					{
						to: 'semester',
						params: {
							id: this.props.student.id,
							year: this.props.year,
							semester: this.props.semester,
						},
					},
					semesterName(this.props.semester))),
				infoBar,
				React.createElement('button', {
					className: 'remove-semester',
					title: `Remove ${this.props.year} ${semesterName(this.props.semester)}`,
					onClick: this.removeSemester,
				})),
			courseList)
	},

	removeSemester() {
		let {year, semester} = this.props
		let currentTermSchedules = this.props.student.schedules.filter(isCurrentSemester(year, semester))

		let scheduleIds = currentTermSchedules.map(s => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},
})

export default Semester

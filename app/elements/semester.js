import isUndefined from 'lodash/lang/isUndefined'
import {DragDropMixin} from 'react-dnd'
import Promise from 'bluebird'
import React from 'react'
import {Link} from 'react-router'
import {pluralize} from 'humanize-plus'
import Immutable from 'immutable'
import cx from 'classnames'

import {add, countCredits, semesterName, isCurrentSemester} from 'sto-helpers'
import Course from './course'
import MissingCourse from './missingCourse'
import EmptyCourseSlot from './emptyCourseSlot'
import studentActions from '../flux/studentActions'
import itemTypes from '../models/itemTypes'

let Semester = React.createClass({
	mixins: [DragDropMixin],

	propTypes: {
		student: React.PropTypes.object.isRequired,
		year: React.PropTypes.number.isRequired,
		semester: React.PropTypes.number.isRequired,
	},

	statics: {
		configureDragDrop(registerType) {
			registerType(itemTypes.COURSE, {
				dropTarget: {
					acceptDrop(component, droppedItem) {
						console.log('dropped component', component)
						let {clbid, fromSchedule} = droppedItem
						let {state, props} = component
						if (fromSchedule)
							studentActions.moveCourse(props.student.id, fromSchedule, state.schedule.id, clbid)
						else
							studentActions.addCourse(props.student.id, state.schedule.id, clbid)
					}
				}
			})
		},
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let activeSchedules = nextProps.student.activeSchedules
		let schedule = activeSchedules.find((s) => s.year === this.props.year && s.semester === this.props.semester)

		Promise.all([schedule.courses, schedule.validate()])
			.then(([courses, validation]) => {
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
			infoIcons.push(
				<li className='semester-course-count' key='course-count'>
					{`${courseCount} ${pluralize(courseCount, 'course')}`}
				</li>)

			let credits = this.state.courses
				.filterNot(isUndefined) // remove any undefined items
				.map(c => c.credits)
				.reduce(add)

			if (credits) {
				infoIcons.push(
					<li className='semester-credit-count' key='credit-count'>
						{`${credits} ${pluralize(credits, 'credit')}`}
					</li>)
			}
		}
		let infoBar = <ul className='info-bar'>{infoIcons}</ul>

		let courseList = null
		if (this.state.schedule && this.state.courses) {
			let courseObjects = this.state.courses
				.filterNot(isUndefined)
				.map((course, i) =>
					<Course key={`${course.clbid}-${i}`}
						index={i}
						info={course}
						student={this.props.student}
						schedule={this.state.schedule}
						conflicts={this.state.validation.conflicts} />)

			let couldntFindSlots = this.state.courses
				.filter(isUndefined) // only keep the undefined items
				.map((c, i) => <MissingCourse key={i} />)

			// maxCredits is 4 for fall/spring and 1 for everything else
			let maxCredits = ([1, 3].indexOf(this.props.semester) !== -1) ? 4 : 1
			let currentCredits = countCredits(this.state.courses.toArray())

			let emptySlots = []
			if (currentCredits < maxCredits) {
				emptySlots =
					Immutable.Range(Math.floor(currentCredits), maxCredits)
					.skip(couldntFindSlots.size)
					.map((i) => <EmptyCourseSlot key={`empty-${i}`} />)
			}

			let courseBlocks = courseObjects
				.concat(couldntFindSlots)
				.concat(emptySlots)
				.toJS()

			courseList = <div className='course-list'>{courseBlocks}</div>
		}
		else if (this.state.schedule) {
			courseList = <div className='loading-spinner'><div>Loading Courses&hellip;</div></div>
		}

		let droppableIsMoving = this.getDropState(itemTypes.COURSE).isDragging
		let droppableIsOver = this.getDropState(itemTypes.COURSE).isHovering

		let semesterProps = {
			className: cx({
				semester: true,
				invalid: this.state.validation.hasConflict,
				'can-drop': droppableIsMoving,
				'is-over': droppableIsOver,
			})
		}

		return <div {...semesterProps, ...this.dropTargetFor(itemTypes.COURSE)}>
			<header className='semester-title'>
				<Link className='semester-header'
					to='semester'
					params={{
						id: this.props.student.id,
						year: this.props.year,
						semester: this.props.semester,
					}}>
					<h1>{semesterName(this.props.semester))}</h1>
					{infoBar}
				</Link>
				<button className='remove-semester'
					onClick={this.removeSemester}
					title={`Remove ${this.props.year} ${semesterName(this.props.semester)}`} />
			</header>
			{courseList}
		</div>
	},

	removeSemester() {
		let {year, semester} = this.props
		let currentTermSchedules = this.props.student.schedules.filter(isCurrentSemester(year, semester))

		let scheduleIds = currentTermSchedules.map(s => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},
})

export default Semester

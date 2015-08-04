import Promise from 'bluebird'
import React, {PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'
import {Link} from 'react-router'
import {DragDropMixin} from 'react-dnd'
import add from 'lodash/math/add'
import isUndefined from 'lodash/lang/isUndefined'
import plur from 'plur'
import range from 'lodash/utility/range'
import ReactListSelect from 'react-list-select'
import {semesterName, isCurrentSemester} from 'sto-helpers'
import countCredits from '../lib/count-credits'

import studentActions from '../flux/student-actions'
import itemTypes from '../models/item-types'
import Student from '../models/student'

import Button from './button'
import Course from './course'
import Icon from './icon'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

let Semester = React.createClass({
	propTypes: {
		semester: PropTypes.number.isRequired,
		student: PropTypes.instanceOf(Student).isRequired,
		year: PropTypes.number.isRequired,
	},

	mixins: [DragDropMixin],

	statics: {
		configureDragDrop(registerType) {
			registerType(itemTypes.COURSE, {
				dropTarget: {
					acceptDrop(component, droppedItem) {
						console.log('dropped component', component)
						let {clbid, fromSchedule} = droppedItem
						let {state, props} = component
						if (fromSchedule) {
							studentActions.moveCourse(props.student.id, fromSchedule, state.schedule.id, clbid)
						}
						else {
							studentActions.addCourse(props.student.id, state.schedule.id, clbid)
						}
					},
				},
			})
		},
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
		const schedule = nextProps.student.schedules
			.filter(sched => sched.active)
			.find(sched => (sched.year === this.props.year) && (sched.semester === this.props.semester))

		Promise.all([schedule.courses, schedule.validate()])
			.then(([courses, validation]) => {
				this.setState({
					schedule,
					courses: Immutable.List(courses),
					validation,
				})
			})
	},

	removeSemester() {
		const scheduleIds = this.props.student.schedules
			.filter(isCurrentSemester(this.props.year, this.props.semester))
			.map(sched => sched.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	render() {
		let infoIcons = []
		if (this.state.schedule && this.state.courses.size) {
			let courseCount = this.state.courses.size
			infoIcons.push(
				<li className='semester-course-count' key='course-count'>
					{`${courseCount} ${plur('course', courseCount)}`}
				</li>
			)

			let credits = this.state.courses
				.filterNot(isUndefined) // remove any undefined items
				.map(c => c.credits)
				.reduce(add)

			if (credits) {
				infoIcons.push(
					<li className='semester-credit-count' key='credit-count'>
						{`${credits} ${plur('credit', credits)}`}
					</li>
				)
			}
		}

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
				.toArray()

			let couldntFindSlots = this.state.courses
				.filter(isUndefined) // only keep the undefined items
				.map((c, i) => <MissingCourse key={i} />)
				.toArray()

			// maxCredits is 4 for fall/spring and 1 for everything else
			let maxCredits = ([1, 3].indexOf(this.props.semester) !== -1) ? 4 : 1
			let currentCredits = countCredits(this.state.courses.toArray())

			let emptySlots = []
			if (currentCredits < maxCredits) {
				emptySlots =
					range(Math.floor(currentCredits), maxCredits)
						.map(i => <EmptyCourseSlot key={`empty-${i}`} />)

			}

			let courseBlocks = courseObjects
				.concat(couldntFindSlots)
				.concat(emptySlots)

			courseList = <ReactListSelect multiple={true} className='course-list' items={courseBlocks} />
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
			}),
		}

		return (
			<div {...semesterProps} {...this.dropTargetFor(itemTypes.COURSE)}>
				<header className='semester-title'>
					<Link className='semester-header'
						to='semester'
						params={{
							id: this.props.student.id,
							year: this.props.year,
							semester: this.props.semester,
						}}>
						<h1>{semesterName(this.props.semester)}</h1>
						<ul className='info-bar'>
							{infoIcons}
						</ul>
					</Link>
					<Button className='remove-semester'
						onClick={this.removeSemester}
						title={`Remove ${this.props.year} ${semesterName(this.props.semester)}`}>
						<Icon name='ionicon-close' />
					</Button>
				</header>
				{courseList}
			</div>
		)
	},
})

export default Semester

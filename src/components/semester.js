import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'
import {Link} from 'react-router'
import {DropTarget} from 'react-dnd'
import add from 'lodash/math/add'
import isUndefined from 'lodash/lang/isUndefined'
import plur from 'plur'
import range from 'lodash/utility/range'
import {semesterName, isCurrentSemester} from 'sto-helpers'
import countCredits from '../lib/count-credits'

import studentActions from '../flux/student-actions'
import itemTypes from '../models/item-types'
import Student from '../models/student'

import Button from './button'
import Course from './course'
import Icon from './icon'
import List from './list'
import Loading from './loading'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

import './semester.scss'

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		console.log('dropped course', item)
		let {clbid, fromScheduleID} = item
		if (fromScheduleID) {
			studentActions.moveCourse(props.student.id, fromScheduleID, component.state.schedule.id, clbid)
		}
		else {
			studentActions.addCourse(props.student.id, component.state.schedule.id, clbid)
		}
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}
}

class Semester extends Component {
	static propTypes = {
		canDrop: PropTypes.bool.isRequired,  // react-dnd
		connectDropTarget: PropTypes.func.isRequired,  // react-dnd
		isOver: PropTypes.bool.isRequired,  // react-dnd
		semester: PropTypes.number.isRequired,
		student: PropTypes.instanceOf(Student).isRequired,
		year: PropTypes.number.isRequired,
	}

	constructor() {
		super()
		this.state = {
			courses: Immutable.List(),
			schedule: null,
			validation: {},
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		const schedule = nextProps.student.schedules
			.filter(sched => sched.active)
			.find(sched => (sched.year === this.props.year) && (sched.semester === this.props.semester))

		Promise.all([
			schedule.courses,
			schedule.validate(),
		]).then(([courses, validation]) => {
			this.setState({
				courses: Immutable.List(courses),
				schedule,
				validation,
			})
		})
	}

	removeSemester = () => {
		const scheduleIds = this.props.student.schedules
			.filter(isCurrentSemester(this.props.year, this.props.semester))
			.map(sched => sched.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	}

	render() {
		let courseList = <Loading>Loading Courses…</Loading>

		let infoBar = []
		if (this.state.schedule && this.state.courses.size) {
			let courseCount = this.state.courses.size
			infoBar.push(
				<li className='semester-course-count' key='course-count'>
					{`${courseCount} ${plur('course', courseCount)}`}
				</li>
			)

			let credits = this.state.courses
				.filterNot(isUndefined) // remove any undefined items
				.map(c => c.credits)
				.reduce(add)

			if (credits) {
				infoBar.push(
					<li className='semester-credit-count' key='credit-count'>
						{`${credits} ${plur('credit', credits)}`}
					</li>
				)
			}
		}

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

			courseList = (
				<List className='course-list' type='plain'>
					{courseObjects}
					{emptySlots}
				</List>
			)
		}

		const className = cx({
			semester: true,
			invalid: this.state.validation.hasConflict,
			'can-drop': this.props.canDrop,
			'is-over': this.props.isOver,
		})

		return this.props.connectDropTarget(
			<div className={className}>
				<header className='semester-title'>
					<Link className='semester-header'
						to='semester'
						params={{
							id: this.props.student.id,
							year: this.props.year,
							semester: this.props.semester,
						}}>
						<h1>{semesterName(this.props.semester)}</h1>
						<List className='info-bar' type='inline'>
							{infoBar}
						</List>
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
	}
}

export default DropTarget(itemTypes.COURSE, semesterTarget, collect)(Semester)

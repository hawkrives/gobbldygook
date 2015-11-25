import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'
import {Link} from 'react-router'
import {DropTarget} from 'react-dnd'
import plur from 'plur'
import range from 'lodash/utility/range'
import includes from 'lodash/collection/includes'
import semesterName from '../helpers/semester-name'
import isCurrentSemester from '../helpers/is-current-semester'
import countCredits from '../area-tools/count-credits'

import studentActions from '../flux/student-actions'
import itemTypes from '../models/item-types'

import Button from './button'
import Course from './course'
import Icon from './icon'
import List from './list'
import Loading from './loading'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

import './semester.scss'

function getSchedule(student, year, semester) {
	return student.schedules
		.filter(sched => sched.active)
		.find(sched => (sched.year === year) && (sched.semester === semester))
}

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		console.log('dropped course', item)
		const {clbid, fromScheduleID} = item
		const toSchedule = getSchedule(component.props.student, component.props.year, component.props.semester)

		if (fromScheduleID) {
			studentActions.moveCourse(props.student.id, fromScheduleID, toSchedule.id, clbid)
		}
		else {
			studentActions.addCourse(props.student.id, toSchedule.id, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		const schedule = getSchedule(props.student, props.year, props.semester)
		const hasClbid = schedule.clbids.contains(item.clbid)
		return !hasClbid
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
		courses: PropTypes.object, // should be an immutable list
		coursesLoaded: PropTypes.bool.isRequired,
		isOver: PropTypes.bool.isRequired,  // react-dnd
		semester: PropTypes.number.isRequired,
		showSearchSidebar: PropTypes.func.isRequired,
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	}

	constructor() {
		super()
		this.state = {
			validation: {},
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		const schedule = getSchedule(nextProps.student, nextProps.year, nextProps.semester)
		schedule.validate().then(validation => this.setState({validation}))
	}

	removeSemester = () => {
		const scheduleIds = this.props.student.schedules
			.filter(isCurrentSemester(this.props.year, this.props.semester))
			.map(sched => sched.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	}

	render() {
		console.log('Semester.render()')
		let courseList = <Loading>Loading Courses…</Loading>

		const schedule = getSchedule(this.props.student, this.props.year, this.props.semester)
		const courses = Immutable.List(this.props.courses)

		// recommendedCredits is 4 for fall/spring and 1 for everything else
		const recommendedCredits = includes([1, 3], this.props.semester) ? 4 : 1
		const currentCredits = courses.size ? countCredits(courses) : 0

		let infoBar = []
		if (schedule && courses.size) {
			const courseCount = courses.size

			infoBar.push(<li key='course-count'>{` – ${courseCount} ${plur('course', courseCount)}`}</li>)
			currentCredits && infoBar.push(<li key='credit-count'>{` – ${currentCredits} ${plur('credit', currentCredits)}`}</li>)
		}

		if (schedule && this.props.coursesLoaded) {
			let courseObjects = courses
				.map((course, i) =>
					course.error
					? <MissingCourse key={course.clbid} clbid={course.clbid} error={course.error} />
					: <Course
						key={course.clbid}
						index={i}
						course={course}
						student={this.props.student}
						schedule={schedule}
						conflicts={this.state.validation.conflicts}
					/>
				)
				.toArray()

			let emptySlots = []
			if (currentCredits < recommendedCredits) {
				const minimumExtraCreditRange = range(Math.floor(currentCredits), recommendedCredits)
				emptySlots = minimumExtraCreditRange.map(i => <EmptyCourseSlot key={`empty-${i}`} />)
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
		})

		return this.props.connectDropTarget(
			<div className={className}>
				<header className='semester-title'>
					<Link className='semester-header'
						to={`/s/${this.props.student.id}/semester/${this.props.year}/${this.props.semester}/`}>
						<h1>{semesterName(this.props.semester)}</h1>

						<List className='info-bar' type='inline'>
							{infoBar}
						</List>
					</Link>

					<span className='buttons'>
						<Button className='add-course'
							onClick={() => this.props.showSearchSidebar({schedule})}
							title='Search for courses'>
							<Icon name='search' /> Course
						</Button>
						<Button className='remove-semester'
							onClick={this.removeSemester}
							title={`Remove ${this.props.year} ${semesterName(this.props.semester)}`}>
							<Icon name='close' />
						</Button>
					</span>
				</header>

				{courseList}
			</div>
		)
	}
}

export default DropTarget(itemTypes.COURSE, semesterTarget, collect)(Semester)

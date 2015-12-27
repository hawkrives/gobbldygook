import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {Link} from 'react-router'
import {DropTarget} from 'react-dnd'
import plur from 'plur'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import filter from 'lodash/collection/filter'
import map from 'lodash/collection/map'
import semesterName from '../helpers/semester-name'
import isCurrentSemester from '../helpers/is-current-semester'
import countCredits from '../area-tools/count-credits'
import validateSchedule from '../helpers/validate-schedule'
import compareProps from '../helpers/compare-props'

import itemTypes from '../models/item-types'
import history from '../history'

import Button from './button'
import CourseList from './course-list'
import Icon from './icon'
import List from './list'
import Loading from './loading'

import './semester.scss'

function getSchedule(student, year, semester) {
	return find(
		filter(student.schedules, sched => sched.active),
		sched => (sched.year === year) && (sched.semester === semester))
}

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		console.log('dropped course', item)
		const {clbid, fromScheduleId, isFromSchedule, labid} = item
		const toSchedule = getSchedule(component.props.student, component.props.year, component.props.semester)

		if (isFromSchedule) {
			props.actions.moveCourse(props.student.id, fromScheduleId, toSchedule.id, clbid)
			labid && props.actions.moveCourse(props.student.id, fromScheduleId, toSchedule.id, labid)
		}
		else {
			props.actions.addCourse(props.student.id, toSchedule.id, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		const schedule = getSchedule(props.student, props.year, props.semester)
		const hasClbid = includes(schedule.clbids, item.clbid)
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
		actions: PropTypes.object,
		canDrop: PropTypes.bool.isRequired,  // react-dnd
		connectDropTarget: PropTypes.func.isRequired,  // react-dnd
		courses: PropTypes.arrayOf(PropTypes.object),
		isOver: PropTypes.bool.isRequired,  // react-dnd
		semester: PropTypes.number.isRequired,
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	}

	static contextTypes = {
		location: React.PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			validation: {conflicts: []},
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		const schedule = getSchedule(nextProps.student, nextProps.year, nextProps.semester)
		validateSchedule(schedule).then(validation => this.setState({validation}))
	}

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state, nextState)
	}

	removeSemester = () => {
		const scheduleIds = map(
			filter(this.props.student.schedules, isCurrentSemester(this.props.year, this.props.semester)),
			sched => sched.id)

		this.props.actions.destroySchedules(this.props.student.id, scheduleIds)
	}

	initiateSearch = schedule => {
		const query = {
			...this.context.location.query,
			partialSearch: JSON.stringify({
				term: `${schedule.year}${schedule.semester}`,
			}),
		}
		history.pushState(null, this.context.location.pathname, query)
	}

	render() {
		// console.log('Semester.render()')
		let courseList = <Loading>Loading Courses…</Loading>

		const schedule = getSchedule(this.props.student, this.props.year, this.props.semester)
		const { actions, courses, semester, student } = this.props

		// recommendedCredits is 4 for fall/spring and 1 for everything else
		const recommendedCredits = (semester === 1 || semester === 3) ? 4 : 1
		const currentCredits = courses.length ? countCredits(courses) : 0

		let infoBar = []
		if (schedule && courses.length) {
			const courseCount = courses.length

			infoBar.push(<li key='course-count'>{` – ${courseCount} ${plur('course', courseCount)}`}</li>)
			currentCredits && infoBar.push(<li key='credit-count'>{` – ${currentCredits} ${plur('credit', currentCredits)}`}</li>)
		}

		if (schedule && courses) {
			courseList = <CourseList
				courses={courses}
				creditCount={currentCredits}
				availableCredits={recommendedCredits}
				student={student}
				schedule={schedule}
				actions={actions}
				conflicts={this.state.validation.conflicts}
			/>
		}

		const className = cx({
			semester: true,
			invalid: this.state.validation.hasConflict,
			'can-drop': this.props.canDrop,
		})

		return this.props.connectDropTarget(
			<div className={className}>
				<header className='semester-title'>
					<Link
						className='semester-header'
						to={`/s/${this.props.student.id}/semester/${this.props.year}/${this.props.semester}/`}
					>
						<h1>{semesterName(this.props.semester)}</h1>

						<List className='info-bar' type='inline'>
							{infoBar}
						</List>
					</Link>

					<span className='buttons'>
						<Button
							className='add-course'
							onClick={this.initiateSearch.bind(this, schedule)}
							title='Search for courses'
						>
							<Icon name='search' /> Course
						</Button>
						<Button
							className='remove-semester'
							onClick={this.removeSemester}
							title={`Remove ${this.props.year} ${semesterName(this.props.semester)}`}
						>
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

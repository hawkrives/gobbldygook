import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import cx from 'classnames'
import Link from 'react-router/lib/Link'
import plur from 'plur'
import semesterName from '../../../helpers/semester-name'
import countCredits from '../../../area-tools/count-credits'
import {COURSE} from '../../../models/item-types'
import {DropTarget} from 'react-dnd'
import includes from 'lodash/includes'

import Button from '../../../components/button'
import Icon from '../../../components/icon'
import List from '../../../components/list'

import CourseList from './course-list'
import './semester.scss'

function Semester(props) {
	let courseList = null

	const { studentId, semester, year, canDrop, schedule } = props
	const { courses, validation } = schedule

	// `recommendedCredits` is 4 for fall/spring and 1 for everything else
	const recommendedCredits = (semester === 1 || semester === 3) ? 4 : 1
	const currentCredits = courses && courses.length ? countCredits(courses) : 0

	let infoBar = []
	if (schedule && courses && courses.length) {
		const courseCount = courses.length

		infoBar.push(<li key='course-count'>{`${courseCount} ${plur('course', courseCount)}`}</li>)
		currentCredits && infoBar.push(<li key='credit-count'>{`${currentCredits} ${plur('credit', currentCredits)}`}</li>)
	}

	if (schedule) {
		courseList = <CourseList
			courses={courses}
			creditCount={currentCredits}
			availableCredits={recommendedCredits}
			studentId={studentId}
			schedule={schedule}
			conflicts={validation ? validation.conflicts : []}
		/>
	}

	const className = cx('semester', {
		invalid: validation ? validation.hasConflict : false,
		'can-drop': canDrop,
	})

	return (
		<div className={className} ref={instance => props.connectDropTarget(findDOMNode(instance))}>
			<header className={'semester-title'}>
				<Link
					className={'semester-header'}
					to={`/s/${studentId}/semester/${year}/${semester}`}
				>
					<h1>{semesterName(semester)}</h1>

					<List className={'semester-info'} type='inline'>
						{infoBar}
					</List>
				</Link>

				<Button link
					to={`/s/${studentId}/search/${year}/${semester}`}
					title='Search for courses'
				>
					<Icon name='search' /> Course
				</Button>
				<Button
					className={'semester-remove'}
					onClick={props.removeSemester}
					title={`Remove ${year} ${semesterName(semester)}`}
				>
					<Icon name='close' />
				</Button>
			</header>

			{courseList}
		</div>
	)
}

Semester.propTypes = {
	addCourse: PropTypes.func.isRequired,  // redux
	canDrop: PropTypes.bool.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	isOver: PropTypes.bool.isRequired,
	moveCourse: PropTypes.func.isRequired, // redux
	removeSemester: PropTypes.func.isRequired,
	schedule: PropTypes.object.isRequired,
	semester: PropTypes.number.isRequired,
	studentId: PropTypes.string.isRequired,
	year: PropTypes.number.isRequired,
}

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor) {
		console.log('dropped course')
		const item = monitor.getItem()
		const {clbid, fromScheduleId, isFromSchedule} = item
		const toSchedule = props.schedule

		if (isFromSchedule) {
			props.moveCourse(props.studentId, fromScheduleId, toSchedule.id, clbid)
		}
		else {
			props.addCourse(props.studentId, toSchedule.id, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		return !includes(props.schedule.clbids, item.clbid)
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

const droppable = DropTarget(COURSE, semesterTarget, collect)(Semester)

export default droppable

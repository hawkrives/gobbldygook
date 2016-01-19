import React, {PropTypes} from 'react'
import cx from 'classnames'
import {Link} from 'react-router'
import plur from 'plur'
import semesterName from '../../../../../helpers/semester-name'
import countCredits from '../../../../../area-tools/count-credits'

import Button from '../../../../../components/button'
import Icon from '../../../../../components/icon'
import List from '../../../../../components/list'

import CourseList from './course-list'
import './semester.scss'


export default function Semester(props) {
	let courseList = null

	const { student, semester, year, canDrop, schedule } = props
	const { courses, validation } = schedule

	// `recommendedCredits` is 4 for fall/spring and 1 for everything else
	const recommendedCredits = (semester === 1 || semester === 3) ? 4 : 1
	const currentCredits = courses && courses.length ? countCredits(courses) : 0

	let infoBar = []
	if (schedule && courses && courses.length) {
		const courseCount = courses.length

		infoBar.push(<li key='course-count'>{` – ${courseCount} ${plur('course', courseCount)}`}</li>)
		currentCredits && infoBar.push(<li key='credit-count'>{` – ${currentCredits} ${plur('credit', currentCredits)}`}</li>)
	}

	if (schedule) {
		courseList = <CourseList
			courses={courses}
			creditCount={currentCredits}
			availableCredits={recommendedCredits}
			student={student}
			schedule={schedule}
			conflicts={validation ? validation.conflicts : []}
		/>
	}

	const className = cx('semester', {
		invalid: validation ? validation.hasConflict : false,
		'can-drop': canDrop,
	})

	return (
		<div className={className}>
			<header className='semester-title'>
				<Link
					className='semester-header'
					to={`/s/${student.id}/semester/${year}/${semester}`}
				>
					<h1>{semesterName(semester)}</h1>

					<List className='info-bar' type='inline'>
						{infoBar}
					</List>
				</Link>

				<span className='buttons'>
					<Button
						className='add-course'
						onClick={props.initiateSearch}
						title='Search for courses'
					>
						<Icon name='search' /> Course
					</Button>
					<Button
						className='remove-semester'
						onClick={props.removeSemester}
						title={`Remove ${year} ${semesterName(semester)}`}
					>
						<Icon name='close' />
					</Button>
				</span>
			</header>

			{courseList}
		</div>
	)
}

Semester.propTypes = {
	canDrop: PropTypes.bool.isRequired,
	initiateSearch: PropTypes.func.isRequired,
	isOver: PropTypes.bool.isRequired,
	removeSemester: PropTypes.func.isRequired,
	schedule: PropTypes.object.isRequired,
	semester: PropTypes.number.isRequired,
	student: PropTypes.object.isRequired,
	year: PropTypes.number.isRequired,
}

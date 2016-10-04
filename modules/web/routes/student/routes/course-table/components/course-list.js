import React, {PropTypes} from 'react'
import {range} from 'lodash'
import {map} from 'lodash'

import InlineCourse from 'modules/web/components/inline-course'
import List from 'modules/web/components/list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

import './course-list.scss'


export default function CourseList(props) {
	// eslint-disable-next-line no-confusing-arrow
	let courseObjects = map(props.schedule.courses, (course, i) =>
		course.error
		? (<li key={course.clbid}>
			<MissingCourse className='course' clbid={course.clbid} error={course.error} />
		</li>)
		: (<li key={course.clbid}>
			<InlineCourse
				index={i}
				className='course'
				course={course}
				conflicts={props.conflicts}
				scheduleId={props.schedule.id}
				studentId={props.studentId}
			/>
		</li>))

	let emptySlots = []
	if (props.creditCount < props.availableCredits) {
		const minimumExtraCreditRange = range(Math.floor(props.creditCount), props.availableCredits)
		emptySlots = map(minimumExtraCreditRange, i => <li key={`empty-${i}`}><EmptyCourseSlot className='course' /></li>)
	}

	return (
		<List className='course-list' type='plain'>
			{courseObjects}
			{emptySlots}
		</List>
	)
}
CourseList.propTypes = {
	availableCredits: PropTypes.number.isRequired,
	conflicts: PropTypes.array.isRequired,
	creditCount: PropTypes.number.isRequired,
	schedule: PropTypes.object.isRequired,
	studentId: PropTypes.string.isRequired,
}

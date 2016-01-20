import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import range from 'lodash/utility/range'
import map from 'lodash/collection/map'

import InlineCourse from '../../../../../components/inline-course'
import List from '../../../../../components/list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

import './course-list.scss'


export default function CourseList(props) {
	let courseObjects = map(props.schedule.courses, (course, i) =>
		course.error
		? <li key={course.clbid}><MissingCourse clbid={course.clbid} error={course.error} /></li>
		: <li key={course.clbid}><Link to={`/s/${props.student.id}/course/${course.clbid}`}><InlineCourse
			index={i}
			course={course}
			student={props.student}
			schedule={props.schedule}
			conflicts={props.conflicts}
		/></Link></li>)

	let emptySlots = []
	if (props.creditCount < props.availableCredits) {
		const minimumExtraCreditRange = range(Math.floor(props.creditCount), props.availableCredits)
		emptySlots = map(minimumExtraCreditRange, i => <li key={`empty-${i}`}><EmptyCourseSlot /></li>)
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
	student: PropTypes.object.isRequired,
}

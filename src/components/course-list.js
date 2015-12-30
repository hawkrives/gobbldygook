import React, {PropTypes} from 'react'
import range from 'lodash/utility/range'
import map from 'lodash/collection/map'

import Course from './course'
import List from './list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

// import './course-list.scss'


export default function CourseList(props) {
	let courseObjects = map(props.courses, (course, i) =>
		course.error
		? <li><MissingCourse key={course.clbid} clbid={course.clbid} error={course.error} /></li>
		: <li><Course
			key={course.clbid}
			index={i}
			actions={props.actions}
			course={course}
			student={props.student}
			schedule={props.schedule}
			conflicts={props.conflicts}
		/></li>)

	let emptySlots = []
	if (props.creditCount < props.availableCredits) {
		const minimumExtraCreditRange = range(Math.floor(props.creditCount), props.availableCredits)
		emptySlots = map(minimumExtraCreditRange, i => <EmptyCourseSlot key={`empty-${i}`} />)
	}

	return (
		<List className='course-list' type='plain'>
			{courseObjects}
			{emptySlots}
		</List>
	)
}
CourseList.propTypes = {
	actions: PropTypes.object.isRequired,
	availableCredits: PropTypes.number.isRequired,
	conflicts: PropTypes.array.isRequired,
	courses: PropTypes.arrayOf(PropTypes.object).isRequired,
	creditCount: PropTypes.number.isRequired,
	schedule: PropTypes.object.isRequired,
	student: PropTypes.object.isRequired,
}

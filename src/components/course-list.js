import React, {PropTypes} from 'react'
import range from 'lodash/utility/range'
import map from 'lodash/collection/map'
import groupBy from 'lodash/collection/groupBy'
import find from 'lodash/collection/find'
import partition from 'lodash/collection/partition'

import Course from './course'
import List from './list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'

// import './course-list.scss'

export default function CourseList(props) {
	let [groupedCourses, nonGroupedCourses] = partition(props.courses, c => 'groupid' in c)

	// this breaks the i-th course thing that the warnins rely on
	let courseObjects = map(groupBy(groupedCourses, 'groupid'), (courseSet, i) => {
		if (courseSet.length > 2) {
			throw new Error(`Uh oh! Groupid ${courseSet[0].groupid} has more than two courses!`)
		}

		let course = find(courseSet, c => c.type !== 'Lab')
		let lab = find(courseSet, {type: 'Lab'})

		return course.error
			? <MissingCourse key={course.clbid} clbid={course.clbid} error={course.error} />
			: <Course
				key={course.clbid}
				index={i}
				actions={props.actions}
				course={course}
				student={props.student}
				schedule={props.schedule}
				conflicts={props.conflicts}
				lab={lab}
			/>
	})

	courseObjects = courseObjects.concat(map(nonGroupedCourses, (course, i) => {
		return course.error
			? <MissingCourse key={course.clbid} clbid={course.clbid} error={course.error} />
			: <Course
				key={course.clbid}
				index={i}
				actions={props.actions}
				course={course}
				student={props.student}
				schedule={props.schedule}
				conflicts={props.conflicts}
			/>
	}))

	let emptySlots = []
	if (props.creditCount < props.availableCredits) {
		const minimumExtraCreditRange = range(Math.floor(props.creditCount), props.availableCredits)
		emptySlots = map(minimumExtraCreditRange, i => <EmptyCourseSlot key={`empty-${i}`} />)
	}

	let courseList = (
		<List className='course-list' type='plain'>
			{courseObjects}
			{emptySlots}
		</List>
	)

	return (
		<div className='course-list'>
			{courseList}
		</div>
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

// @flow
import React from 'react'
import range from 'lodash/range'
import styled, {css} from 'styled-components'
import {DraggableCourse} from '../course'
import {PlainList, ListItem} from '../../components/list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'
import * as theme from '../../theme'

const courseStyles = css`
	${theme.semesterPadding};

	&:hover {
		background-color: ${theme.gray100};
	}
`

const List = styled(PlainList)`
	min-height: 30px;
	padding-bottom: 0.25em;

	&:focus {
		outline: 0;
	}
`

const Item = styled(ListItem)`
	&:last-child {
		border-bottom: 0;
	}
`

const Missing = styled(MissingCourse)`
	${courseStyles};
`
const Course = styled(DraggableCourse)`
	${courseStyles};
`
const Empty = styled(EmptyCourseSlot)`
	${courseStyles};
`

type Props = {
	courses: Array<Object>,
	usedSlots: number,
	conflicts: Object[],
	maxSlots: number,
	schedule: Object,
	studentId: string,
}

export default function CourseList(props: Props) {
	const courseObjects = props.courses.map(
		(course, i) =>
			course.error ? (
				<Missing id={course.id} error={course.error} />
			) : (
				<Course
					index={i}
					course={course}
					conflicts={props.conflicts}
					scheduleId={props.schedule.id}
					studentId={props.studentId}
				/>
			),
	)

	if (props.usedSlots < 0 || props.maxSlots < 0) {
		throw new Error('usedSlots and maxSlots must be >= 0')
	}

	let usedSlots = Math.floor(props.usedSlots)
	let emptySlots =
		usedSlots < props.maxSlots ? range(usedSlots, props.maxSlots) : []
	emptySlots = emptySlots.map(n => <Empty key={n} />)

	return (
		<List className="course-list">
			{[...courseObjects, ...emptySlots].map((child, i) => (
				<Item key={i}>{child}</Item>
			))}
		</List>
	)
}

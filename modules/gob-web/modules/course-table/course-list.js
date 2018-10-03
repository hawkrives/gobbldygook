// @flow

import React from 'react'
import range from 'lodash/range'
import styled, {css} from 'styled-components'
import {DraggableCourse} from '../course'
import {PlainList, ListItem} from '../../components/list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'
import {type WarningType} from '@gob/object-student'
import {Map, List as IList} from 'immutable'
import type {Course as CourseType, CourseError} from '@gob/types'

const courseStyles = css`
	padding: var(--block-edge-padding) var(--semester-side-padding);

	&:hover {
		background-color: var(--gray-100);
	}
`

const List = styled(PlainList)`
	min-height: 30px;

	&:focus {
		outline: 0;
	}
`

const Item = styled(ListItem)`
	& + & {
		border-top: solid 1px #eaeaea;
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
	courses: Array<CourseType | CourseError>,
	usedSlots: number,
	warnings: Map<string, IList<?WarningType>>,
	maxSlots: number,
	scheduleId: string,
	studentId: string,
}

export function CourseList(props: Props) {
	const courseObjects = props.courses.map(
		(course, i) =>
			course.error ? (
				<Missing key={i} clbid={course.clbid} error={course.error} />
			) : (
				<Course
					key={i}
					index={i}
					course={course}
					conflicts={props.warnings}
					scheduleId={props.scheduleId}
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

// @flow

import React from 'react'
import FakeCourse from './fake-course'
import styled from 'styled-components'

const Course = styled(FakeCourse)`
	color: var(--gray-500);
	user-select: none;

	&:hover {
		cursor: default;
		background-color: white !important;
	}
`

export default function EmptyCourseSlot(props: {className: string}) {
	return <Course title="Empty Slot" className={props.className} />
}

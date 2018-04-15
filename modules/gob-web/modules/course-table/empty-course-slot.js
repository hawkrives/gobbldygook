// @flow
import React from 'react'
import FakeCourse from './fake-course'
import styled from 'styled-components'
import * as theme from '../../theme'

const Course = styled(FakeCourse)`
	color: ${theme.gray500};
	user-select: none;

	* {
		cursor: default;
	}
`

export default function EmptyCourseSlot(props: {className: string}) {
	return <Course title="Empty Slot" className={props.className} />
}

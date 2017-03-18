// @flow
import React from 'react'
import FakeCourse from './fake-course'
import styled from 'styled-components'

const Course = styled(FakeCourse)`
    color: ${props => props.theme.gray500};
    user-select: none;

    * {
        cursor: default;
    }
`

export default function EmptyCourseSlot(props: { className: string }) {
    return <Course title="Empty Slot" className={props.className} />
}

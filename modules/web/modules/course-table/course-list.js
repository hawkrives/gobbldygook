// @flow
import React from 'react'
import range from 'lodash/range'
import map from 'lodash/map'
import styled, { css } from 'styled-components'
import { DraggableCourse } from '../course'
import { PlainList, ListItem } from '../../components/list'
import MissingCourse from './missing-course'
import EmptyCourseSlot from './empty-course-slot'
import { semesterPadding } from './variables'

const courseStyles = css`
    ${semesterPadding}

    &:hover {
        background-color: ${props => props.theme.gray100};
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

const Missing = styled(MissingCourse)`${courseStyles}`
const Course = styled(DraggableCourse)`${courseStyles}`
const Empty = styled(EmptyCourseSlot)`${courseStyles}`

type PropTypes = {
    availableCredits: number,
    conflicts: Object[],
    creditCount: number,
    schedule: Object,
    studentId: string,
};

export default function CourseList(props: PropTypes) {
    const courseObjects = map(
        props.schedule.courses,
        (course, i) =>
            course.error
                ? <Missing clbid={course.clbid} error={course.error} />
                : <Course
                      index={i}
                      course={course}
                      conflicts={props.conflicts}
                      scheduleId={props.schedule.id}
                      studentId={props.studentId}
                  />
    )

    const usedCredits = Math.floor(props.creditCount)
    const emptySlots = range(usedCredits, props.availableCredits)
        .filter(n => n >= 0)
        .map(n => <Empty key={n} />)

    return (
        <List className="course-list">
            {[...courseObjects, ...emptySlots].map((child, i) => (
                <Item key={i}>{child}</Item>
            ))}
        </List>
    )
}

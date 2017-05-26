// @flow
import React from 'react'
import map from 'lodash/map'
import noop from 'lodash/noop'
import styled from 'styled-components'

import { InlineList, InlineListItem } from '../../components/list'
import CourseTitle from './course-title'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'
import CourseWarnings from './warnings'

export const Container = styled.article`
    display: block;

    &:hover {
        cursor: pointer;
        background-color: ${props => props.theme.gray100};
    }

    &.is-dragging {
        opacity: 0.5;
    }
`

const Row = `
    overflow: hidden;
    line-height: 1.5;
`

export const Title = styled(CourseTitle)`
    ${Row}
`

export const SummaryRow = styled.div`
    ${Row}
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.75em;

    & > * + *:not(:empty)::before {
        margin: 0 0.2em;
        content: "·";
    }
`

const GeReqItem = styled(InlineListItem)`
    & + &::before {
        margin: 0 0.2em;
        content: "+";
    }
`

const Identifier = styled.span`
    font-feature-settings: "tnum";
`

const Type = styled.span``
const Prereqs = styled.span``

export default class CompactCourse extends React.PureComponent {
    props: {
        className?: string,
        conflicts?: any[],
        course: Object,
        index?: number,
        onClick?: Event => any,
    }

    render() {
        const { course, conflicts = [], index, onClick = noop } = this.props

        return (
            <Container className={this.props.className} onClick={onClick}>
                <CourseWarnings warnings={conflicts[index || 0]} />

                <Title
                    title={course.title}
                    name={course.name}
                    type={course.type}
                />

                <SummaryRow>
                    <Identifier>
                        {buildDeptNum(course, true)}
                    </Identifier>
                    {course.type !== 'Research' && <Type>{course.type}</Type>}
                    {course.gereqs &&
                        <InlineList>
                            {map(course.gereqs, ge => (
                                <GeReqItem key={ge}>{ge}</GeReqItem>
                            ))}
                        </InlineList>}
                    {course.prerequisites &&
                        <Prereqs title={course.prerequisites}>
                            Prereq
                        </Prereqs>}
                </SummaryRow>
                <SummaryRow>
                    {map(course.times, timestring => (
                        <span key={timestring}>{timestring}</span>
                    ))}
                </SummaryRow>
            </Container>
        )
    }
}

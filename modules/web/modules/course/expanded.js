// @flow
import React from 'react'
import styled from 'styled-components'
import map from 'lodash/map'
import flatMap from 'lodash/flatMap'
import oxford from 'listify'
import {BulletedList, ListItem} from '../../components/list'
import CourseTitle from './course-title'
import {semesterName} from '../../../school-st-olaf-college/course-info'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'
import { to12HourTime } from '../../../lib'

const Heading = styled.h2`
    font-weight: 500;
    font-feature-settings: "smcp";
    font-size: 1em;
    margin-bottom: 0;
`

const Description = styled.div`
    hyphens: auto;
`

const Column = styled.div`
    flex: 1;

    @media screen and (min-width: 45em) {
        & + & {
            margin-left: 3em;
        }
    }
`

const InfoSegment = styled.div`
    padding-bottom: 20px
`

const ColumnsWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;

    @media screen and (max-width: 45em) {
        flex-flow: column;
    }
`

const SummaryThing = styled.div`
    white-space: normal;
`


export default class ExpandedCourse extends React.PureComponent {
    props: {
        className?: string,
        course: Object,
    };

    render() {
        const { course, className } = this.props

        const infoColumn = (
            <Column>
                {course.description &&
                    <Description>
                        <Heading>Description</Heading>
                        <p>{course.description}</p>
                    </Description>}

                <p>
                    Offered in {semesterName(course.semester)} {course.year}.
                </p>

                <p>
                    {course.credits || 0}
                    {` ${course.credits === 1 ? 'credit' : 'credits'}.`}
                </p>
            </Column>
        )

        const detailColumn = (
            <Column>
                {course.prerequisites &&
                    <div>
                        <Heading>Prerequisites</Heading>
                        <p>{course.prerequisites}</p>
                    </div>}

                {course.times &&
                    <div>
                        <Heading>
                            {course.offerings && course.offerings.length === 1
                                ? 'Offering'
                                : 'Offerings'}
                        </Heading>
                        <BulletedList>
                            {flatMap(course.offerings, offering =>
                                map(offering.times, time => {
                                    const key = `${offering.day}-${time.start}-${time.end}`
                                    return (
                                        <ListItem key={key}>
                                            {offering.day}{' from '}
                                            {to12HourTime(time.start)}
                                            {' to '}{to12HourTime(time.end)}
                                            {', in '}
                                            {offering.location}
                                        </ListItem>
                                    )
                                }))}
                        </BulletedList>
                    </div>}

                {course.instructors &&
                    <div>
                        <Heading>
                            {course.instructors &&
                                course.instructors.length === 1
                                ? 'Instructor'
                                : 'Instructors'}
                        </Heading>
                        <div>{oxford(course.instructors)}</div>
                    </div>}

                {course.gereqs &&
                    <div>
                        <Heading>G.E. Requirements</Heading>
                        <BulletedList>
                            {map(course.gereqs, ge => (
                                <ListItem key={ge}>{ge}</ListItem>
                            ))}
                        </BulletedList>
                    </div>}
            </Column>
        )

        return (
            <div className={className}>
                <InfoSegment>
                    <CourseTitle {...course} />

                    <SummaryThing>
                        <span className="identifier">
                            {buildDeptNum(course, true)}
                        </span>
                        {' • '}
                        <span className="type">{course.type}</span>
                    </SummaryThing>
                </InfoSegment>

                <ColumnsWrapper>
                    {infoColumn}
                    {detailColumn}
                </ColumnsWrapper>
            </div>
        )
    }
}

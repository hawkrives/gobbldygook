// @flow
import React from 'react'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import noop from 'lodash/noop'
import oxford from 'listify'
import styled from 'styled-components'
import Modal from '../../components/modal'
import {BulletedList, ListItem} from '../../components/list'
import Separator from '../../components/separator'
import Toolbar from '../../components/toolbar'
import Button from '../../components/button'
import CourseTitle from './course-title'
import {
    semesterName,
    expandYear,
} from '../../../school-st-olaf-college/course-info'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'

import { to12HourTime } from '../../../lib'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    addCourse,
    moveCourse,
    removeCourse,
} from '../../redux/students/actions/courses'

const Container = styled.div`
    ${props => props.theme.card}

    display: flex;
    flex-flow: column;
    max-width: 45em;

    p, ul, ol {
        margin: 0;
    }
`

const VerticalSegment = `
    padding: 0 20px;
`

const BottomToolbar = styled.div`
    ${VerticalSegment}

    border-top: ${props => props.theme.materialDivider};
    margin-top: 0.5em;
    padding-top: 0.5em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`

const RemoveCourseButton = styled(Button)`
    color: ${props => props.theme.red500};
    padding-left: 0.5em;
    padding-right: 0.5em;
    font-size: 0.85em;
    &:hover {
        background-color: ${props => props.theme.red50};
        border-color: ${props => props.theme.red500};
    }

    &[disabled] {
        color: ${props => props.theme.gray500};
    }
    &[disabled]:hover {
        background-color: transparent;
        border-color: transparent;
    }
`

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
    ${VerticalSegment}
`

const ColumnsWrapper = styled.div`
    ${VerticalSegment}
    display: flex;
    flex-flow: row nowrap;

    @media screen and (max-width: 45em) {
        flex-flow: column;
    }
`

const SummaryThing = styled.div`
    white-space: normal;
`

function findSemesterList(student: ?Object) {
    if (!student) {
        return {}
    }

    let schedules = map(student.schedules, s => ({
        ...s,
        title: `${semesterName(s.semester)} – ${s.title}`,
    }))

    return groupBy(
        sortBy(schedules, [s => s.year, s => s.semester]),
        s => s.year
    )
}

const removeFromSemester = ({ studentId, removeCourse, clbid, scheduleId }) =>
    () => {
        if (studentId) {
            removeCourse(studentId, scheduleId, clbid)
        }
    }

const moveToSchedule = (
    { moveCourse, addCourse, removeCourse, scheduleId, studentId, clbid }
) =>
    ev => {
        const targetScheduleId = ev.target.value
        if (targetScheduleId === '$none') {
            return
        } else if (targetScheduleId === '$remove') {
            return removeCourse(studentId, scheduleId, clbid)
        }

        if (scheduleId) {
            return moveCourse(studentId, scheduleId, targetScheduleId, clbid)
        } else {
            return addCourse(studentId, targetScheduleId, clbid)
        }
    }

function SemesterSelector(
    {
        scheduleId,
        student,
        moveCourse,
        addCourse,
        removeCourse,
        clbid,
    }: {
        addCourse: () => any,
        clbid?: number,
        moveCourse: () => any,
        removeCourse: () => any,
        scheduleId?: string,
        student?: Object,
    }
) {
    const studentId = student ? student.id : null
    const specialOption = scheduleId
        ? <option value="$remove">Remove from Schedule</option>
        : <option value="$none">No Schedule</option>

    const options = map(findSemesterList(student), (group, year) => (
        <optgroup key={year} label={expandYear(year, true, '–')}>
            {map(group, schedule => (
                <option value={schedule.id} key={schedule.id}>
                    {schedule.title}
                </option>
            ))}
        </optgroup>
    ))

    return (
        <select
            value={scheduleId || 'none'}
            disabled={!student || !clbid}
            onChange={moveToSchedule({
                moveCourse,
                addCourse,
                removeCourse,
                scheduleId,
                studentId,
                clbid,
            })}
        >
            {specialOption}
            {options}
        </select>
    )
}

class ExpandedCourse extends React.PureComponent {
    props: {
        course: Object,
    };

    render() {
        const { course } = this.props

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
            <div>
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

function ModalCourse(
    props: {
        addCourse?: () => any, // redux
        course: Object, // parent
        moveCourse?: () => any, // redux
        onClose: () => any, // parent
        removeCourse?: () => any, // redux
        scheduleId?: string, // parent
        student?: Object, // redux
        studentId?: string, // parent
    }
) {
    const {
        course,
        student,
        studentId,
        scheduleId,
        removeCourse = noop,
        addCourse = noop,
        moveCourse = noop,
        onClose,
    } = props

    return (
        <Modal onClose={onClose} contentLabel="Course">
            <Container>
                <Toolbar>
                    <Separator type="flex-spacer" flex={3} />
                    <Button type="raised" onClick={onClose}>Close</Button>
                </Toolbar>

                <ExpandedCourse course={course} />

                <BottomToolbar>
                    <SemesterSelector
                        scheduleId={scheduleId}
                        student={student}
                        moveCourse={moveCourse}
                        addCourse={addCourse}
                        removeCourse={removeCourse}
                        clbid={course.clbid}
                    />
                    <RemoveCourseButton
                        onClick={removeFromSemester({
                            studentId,
                            removeCourse,
                            clbid: course.clbid,
                            scheduleId,
                        })}
                        disabled={!scheduleId || !student}
                    >
                        Remove Course
                    </RemoveCourseButton>
                </BottomToolbar>
            </Container>
        </Modal>
    )
}

const mapState = (state, ownProps) => {
    if (ownProps.studentId) {
        return {
            student: state.students[ownProps.studentId].data.present,
        }
    }
    return {}
}

const mapDispatch = dispatch =>
    bindActionCreators({ addCourse, moveCourse, removeCourse }, dispatch)

// $FlowFixMe
export default connect(mapState, mapDispatch)(ModalCourse)

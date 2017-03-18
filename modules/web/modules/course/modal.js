// @flow
import React from 'react'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import oxford from 'listify'

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

import './modal.scss'

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
            <div className="column">
                {course.description &&
                    <div className="description">
                        <h2>Description</h2>
                        <p>{course.description}</p>
                    </div>}

                <p>
                    Offered in {semesterName(course.semester)} {course.year}.
                </p>

                <p>
                    {course.credits || 0}
                    {course.credits === 1 ? ' credit.' : ' credits.'}
                </p>
            </div>
        )

        const detailColumn = (
            <div className="column">
                {course.prerequisites &&
                    <div>
                        <h2>Prerequisites</h2>
                        <p>{course.prerequisites}</p>
                    </div>}

                {course.times &&
                    <div>
                        <h2>
                            {course.offerings && course.offerings.length === 1
                                ? 'Offering'
                                : 'Offerings'}
                        </h2>
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
                        <h2>
                            {course.instructors &&
                                course.instructors.length === 1
                                ? 'Instructor'
                                : 'Instructors'}
                        </h2>
                        <div>{oxford(course.instructors)}</div>
                    </div>}

                {course.gereqs &&
                    <div>
                        <h2>G.E. Requirements</h2>
                        <BulletedList>
                            {map(course.gereqs, ge => (
                                <ListItem key={ge}>{ge}</ListItem>
                            ))}
                        </BulletedList>
                    </div>}
            </div>
        )

        return (
            <div>
                <div className="info-wrapper">
                    <CourseTitle {...course} />

                    <div className="summary">
                        <span className="identifier">
                            {buildDeptNum(course, true)}
                        </span>
                        {' • '}
                        <span className="type">{course.type}</span>
                    </div>
                </div>

                <div className="columns">
                    {infoColumn}
                    {detailColumn}
                </div>
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
        removeCourse,
        addCourse,
        moveCourse,
        onClose,
    } = props

    return (
        <Modal onClose={onClose} contentLabel="Course">
            <div className="course--modal">
                <Toolbar>
                    <Separator type="flex-spacer" flex={3} />
                    <Button type="raised" onClick={onClose}>Close</Button>
                </Toolbar>

                <ExpandedCourse course={course} />

                <div className="tools">
                    <SemesterSelector
                        scheduleId={scheduleId}
                        student={student}
                        moveCourse={moveCourse}
                        addCourse={addCourse}
                        removeCourse={removeCourse}
                        clbid={course.clbid}
                    />
                    <Button
                        className="remove-course"
                        onClick={removeFromSemester({
                            studentId,
                            removeCourse,
                            clbid: course.clbid,
                            scheduleId,
                        })}
                        disabled={!scheduleId || !student}
                    >
                        Remove Course
                    </Button>
                </div>
            </div>
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

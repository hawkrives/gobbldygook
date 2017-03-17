import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import cx from 'classnames'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import isNull from 'lodash/isNull'
import map from 'lodash/map'

import { IDENT_COURSE } from '../../../object-student/item-types'

import List from '../../components/list'
import CourseTitle from './course-title'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'
import Icon from '../../components/icon'
import ModalCourse from './modal-course'

import {
    iosClockOutline,
    iosCalendarOutline,
    alertCircled,
} from '../../icons/ionicons'

import './inline-course.scss'

type InlineCourseProps = {
    className?: string,
    conflicts?: any[],
    connectDragSource: () => any, // react-dnd
    course: Object,
    index?: number,
    isDragging: boolean, // react-dnd
    scheduleId?: string,
    studentId?: string,
};

const warningsMap = {
    'time-conflict': iosClockOutline,
    'invalid-semester': iosCalendarOutline,
    'invalid-year': alertCircled,
}

class InlineCourse extends Component {
    props: InlineCourseProps;

    state = {
        isOpen: false,
    };

    shouldComponentUpdate(nextProps: InlineCourseProps, nextState) {
        return this.props.course !== nextProps.course ||
            this.props.conflicts !== nextProps.conflicts ||
            this.state.isOpen !== nextState.isOpen ||
            this.props.isDragging !== nextProps.isDragging
    }

    closeModal = () => {
        this.setState({ isOpen: false })
    };

    openModal = () => {
        this.setState({ isOpen: true })
    };

    render() {
        const {
            course,
            conflicts = [],
            index,
            scheduleId,
            studentId,
        } = this.props
        const warnings = conflicts[index || 0]
        const hasWarnings = compact(warnings).length

        const validWarnings = filter(
            warnings,
            w => !isNull(w) && w.warning === true
        )
        const warningEls = map(validWarnings, (w, idx) => (
            <li key={idx}><Icon>{warningsMap[w.type]}</Icon> {w.msg}</li>
        ))

        let classSet = cx(this.props.className, 'course', {
            expanded: this.state.isOpen,
            'has-warnings': hasWarnings,
            'is-dragging': this.props.isDragging,
        })

        const warningList = warningEls.length &&
            <List type="inline" className="course-warnings">{warningEls}</List>

        return this.props.connectDragSource(
            <article className={classSet} onClick={this.openModal}>
                {warningList || null}

                <CourseTitle
                    className="course-row"
                    title={course.title}
                    name={course.name}
                    type={course.type}
                />
                <div className="course-row course-summary">
                    <span className="course-identifier">
                        {buildDeptNum(course, true)}
                    </span>
                    {course.type !== 'Research'
                        ? <span className="course-type">{course.type}</span>
                        : null}
                    {course.gereqs &&
                        <ul className="course-gereqs">
                            {map(course.gereqs, (ge, idx) => (
                                <li key={ge + idx}>{ge}</li>
                            ))}
                        </ul>}
                    {course.prerequisites &&
                        <span
                            className="has-prerequisite"
                            title={course.prerequisites}
                        >
                            Prereq
                        </span>}
                </div>
                <div className="course-row course-summary">
                    {map(course.times, (timestring, i) => <span key={i}>{timestring}</span>)}
                </div>

                {this.state.isOpen
                    ? <ModalCourse
                          onClose={this.closeModal}
                          course={course}
                          scheduleId={scheduleId}
                          studentId={studentId}
                      />
                    : null}
            </article>
        )
    }
}

// Implements the drag source contract.
const courseSource = {
    beginDrag(props) {
        let scheduleId = props.scheduleId || null
        return {
            isFromSchedule: scheduleId !== null,
            isFromSearch: scheduleId === null,
            clbid: props.course.clbid,
            groupid: props.course.groupid,
            fromScheduleId: scheduleId,
        }
    },
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

export default DragSource(IDENT_COURSE, courseSource, collect)(InlineCourse)

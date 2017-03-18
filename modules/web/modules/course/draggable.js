import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import cx from 'classnames'
import filter from 'lodash/filter'
import isNull from 'lodash/isNull'
import map from 'lodash/map'
import styled from 'styled-components'
import { IDENT_COURSE } from '../../../object-student/item-types'

import List from '../../components/list'
import CourseTitle from './course-title'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'
import Icon from '../../components/icon'
import ModalCourse from './modal'

import {
    iosClockOutline,
    iosCalendarOutline,
    alertCircled,
} from '../../icons/ionicons'

const Container = styled.article`
    display: block;

    & p,
    & ul {
        margin: 0;
    }

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

const Title = styled(CourseTitle)`
    ${Row}
`

const SummaryRow = styled.div`
    ${Row}
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.75em;

    & > * + *:not(:empty)::before {
        content: " · ";
    }
`

const GeReqsList = styled(List)`
    li + li::before {
        content: " + ";
    }
`

const Identifier = styled.span`
    font-feature-settings: "tnum";
`

const Type = styled.span``
const Prereqs = styled.span``

const Warnings = styled(List)`
    font-size: 0.85em;
    font-feature-settings: "onum";
    padding-bottom: 2px;

    & .list-item {
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        padding: 0.125em 0.35em;
        border-radius: 0.25em;
        background-color: ${props => props.theme.amber200};
    }
    & .icon {
        margin-right: 0.35em;
    }
`

type PropTypes = {
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

class DraggableCourse extends Component {
    props: PropTypes;

    state = {
        isOpen: false,
    };

    shouldComponentUpdate(nextProps: PropTypes, nextState) {
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

        const classSet = cx(this.props.className, {
            'is-dragging': this.props.isDragging,
        })

        const warnings = filter(
            conflicts[index || 0],
            w => !isNull(w) && w.warning === true
        )
        const warningList = warnings.length &&
            <Warnings type="inline">
                {map(warnings, (w, idx) => (
                    <li key={idx}>
                        <Icon>{warningsMap[w.type]}</Icon> {w.msg}
                    </li>
                ))}
            </Warnings>

        return this.props.connectDragSource(
            <Container className={classSet} onClick={this.openModal}>
                {warningList || null}

                <Title
                    title={course.title}
                    name={course.name}
                    type={course.type}
                />
                <SummaryRow>
                    <Identifier>
                        {buildDeptNum(course, true)}
                    </Identifier>
                    {course.type !== 'Research'
                        ? <Type>{course.type}</Type>
                        : null}
                    {course.gereqs &&
                        <GeReqsList type="inline">
                            {map(course.gereqs, (ge, idx) => (
                                <li key={ge + idx}>{ge}</li>
                            ))}
                        </GeReqsList>}
                    {course.prerequisites &&
                        <Prereqs title={course.prerequisites}>
                            Prereq
                        </Prereqs>}
                </SummaryRow>
                <SummaryRow>
                    {map(course.times, (timestring, i) => (
                        <span key={i}>{timestring}</span>
                    ))}
                </SummaryRow>

                {this.state.isOpen
                    ? <ModalCourse
                          onClose={this.closeModal}
                          course={course}
                          scheduleId={scheduleId}
                          studentId={studentId}
                      />
                    : null}
            </Container>
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

export default DragSource(IDENT_COURSE, courseSource, collect)(DraggableCourse)

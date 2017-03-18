import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import cx from 'classnames'
import map from 'lodash/map'
import styled from 'styled-components'
import { IDENT_COURSE } from '../../../object-student/item-types'

import { InlineList, InlineListItem } from '../../components/list'
import CourseTitle from './course-title'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'
import ModalCourse from './modal'
import { CourseWarnings } from './warnings'

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

const GeReqsList = styled(InlineList)``

const GeReqItem = styled(InlineListItem)`
    & + &::before {
        content: " + ";
    }
`

const Identifier = styled.span`
    font-feature-settings: "tnum";
`

const Type = styled.span``
const Prereqs = styled.span``

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

        return this.props.connectDragSource(
            <Container className={classSet} onClick={this.openModal}>
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
                    {course.type !== 'Research'
                        ? <Type>{course.type}</Type>
                        : null}
                    {course.gereqs &&
                        <GeReqsList>
                            {map(course.gereqs, ge => (
                                <GeReqItem key={ge}>{ge}</GeReqItem>
                            ))}
                        </GeReqsList>}
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

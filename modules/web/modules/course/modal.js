// @flow
import React from 'react'
import noop from 'lodash/noop'
import styled from 'styled-components'
import Modal from '../../components/modal'
import Separator from '../../components/separator'
import Toolbar from '../../components/toolbar'
import Button from '../../components/button'
import SemesterSelector from './semester-selector'
import ExpandedCourse from './expanded'
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

const Course = styled(ExpandedCourse)`
    ${VerticalSegment}
`

const removeFromSemester = ({ studentId, removeCourse, clbid, scheduleId }) =>
    () => {
        if (studentId) {
            removeCourse(studentId, scheduleId, clbid)
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

                <Course course={course} />

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

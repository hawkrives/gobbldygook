// @flow
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from './button'
import Icon from './icon'
import Toolbar from './toolbar'
import Separator from './separator'
import CourseRemovalBox from './course-removal-box'
import { undo, redo } from '../redux/students/actions/undo'
import { removeCourse } from '../redux/students/actions/courses'
import {
    iosUndo,
    iosUndoOutline,
    iosRedo,
    iosRedoOutline,
    iosSearch,
    iosPeopleOutline,
    iosUploadOutline,
} from '../icons/ionicons'

import styled from 'styled-components'

type StudentType = Object
type PropTypes = {
    children: React$Element<any>,
    redo: string => any,
    removeCourse: Function,
    student: {
        data: {
            past: StudentType[],
            present: StudentType,
            future: StudentType[],
        },
    },
    undo: string => any,
}

const StudentButtonsToolbar = styled(Toolbar)`margin-bottom: 0.5em;`

const SidebarElement = styled.aside`
    ${props => props.theme.contentBlockSpacing}

    flex: 1;

    @media all and (min-width: 35em) {
        max-width: 280px;
        padding-left: ${props => props.theme.pageEdgePadding};
        padding-right: calc(${props => props.theme.pageEdgePadding} * (2/3));
    }
`

function Sidebar(props: PropTypes) {
    const { undo, redo } = props
    const studentId = props.student.data.present.id
    const canUndo = props.student.data.past.length > 0
    const canRedo = props.student.data.future.length > 0

    return (
        <SidebarElement>
            <StudentButtonsToolbar>
                <Button link to="/" title="Students">
                    <Icon type="block">{iosPeopleOutline}</Icon>
                </Button>
                <Button link to={`/s/${studentId}/search`} title="Search">
                    <Icon type="block">{iosSearch}</Icon>
                </Button>

                <Separator type="spacer" />

                <Button
                    title="Undo"
                    onClick={() => undo(studentId)}
                    disabled={!canUndo}
                >
                    <Icon type="block">
                        {!canUndo ? iosUndoOutline : iosUndo}
                    </Icon>
                </Button>
                <Button
                    title="Redo"
                    onClick={() => redo(studentId)}
                    disabled={!canRedo}
                >
                    <Icon type="block">
                        {!canRedo ? iosRedoOutline : iosRedo}
                    </Icon>
                </Button>

                <Separator type="spacer" />

                <Button link to={`/s/${studentId}/share`} title="Share">
                    <Icon type="block">{iosUploadOutline}</Icon>
                </Button>
            </StudentButtonsToolbar>

            <CourseRemovalBox
                removeCourse={(scheduleId, clbid) =>
                    props.removeCourse(studentId, scheduleId, clbid)}
            />

            {props.children}
        </SidebarElement>
    )
}

const mapDispatch = dispatch =>
    bindActionCreators({ undo, redo, removeCourse }, dispatch)

// $FlowFixMe
export default connect(undefined, mapDispatch)(Sidebar)

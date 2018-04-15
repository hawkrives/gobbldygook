// @flow
import React from 'react'
import {DropTarget} from 'react-dnd'
import debug from 'debug'
import styled, {css} from 'styled-components'
const log = debug('web:courses')
import * as theme from '../theme'
import {IDENT_COURSE} from '@gob/object-student'
import {BlockIcon} from './icon'
import {iosTrashOutline} from '../icons/ionicons'

const Box = styled.div`
    padding: 5em 1em;
    color: ${theme.gray500};
    background-color: white;
    border-radius: 5px;

    position: fixed;
    top: calc(${theme.pageEdgePadding} * 2);
    left: calc(${theme.pageEdgePadding} * 2);
    max-width: 240px;

    display: none;
    box-shadow: 0 0 10px #444;

    ${props =>
        props.canDrop &&
        css`
            color: black;
            display: flex;
            z-index: ${theme.zSidebar + 1};
        `};
    ${props =>
        props.isOver &&
        css`
            box-shadow: 0 0 10px ${theme.red900};
            color: ${theme.red900};
            background-color: ${theme.red50};
        `};
`

type Props = {
    canDrop: boolean, // react-dnd
    connectDropTarget: (React$Element<*>) => any, // react-dnd
    isOver: boolean, // react-dnd
    removeCourse: (string, number) => any, // studentId is embedded in the passed function
}
function CourseRemovalBox(props: Props) {
    // we have to return an actual <div> here for ReactDnD
    return props.connectDropTarget(
        <div>
            <Box isOver={props.isOver} canDrop={props.canDrop}>
                <BlockIcon style={{fontSize: '3em', textAlign: 'center'}}>
                    {iosTrashOutline}
                </BlockIcon>
                Drop a course here to remove it.
            </Box>
        </div>,
    )
}

// Implements the drag source contract.
const removeCourseTarget = {
    drop(props, monitor: any) {
        const item = monitor.getItem()
        const {clbid, fromScheduleId, isFromSchedule} = item
        if (isFromSchedule) {
            log('dropped course', item)
            // the studentId is embedded in the passed function
            props.removeCourse(fromScheduleId, clbid)
        }
    },
    canDrop(props, monitor: any) {
        const {isFromSearch} = monitor.getItem()
        if (!isFromSearch) {
            return true
        }
        return false
    },
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }
}

export default DropTarget(IDENT_COURSE, removeCourseTarget, collect)(
    CourseRemovalBox,
)

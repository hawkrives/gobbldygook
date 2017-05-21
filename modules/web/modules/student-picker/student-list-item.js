// @flow
import React from 'react'
import cx from 'classnames'
import Link from 'react-router/lib/Link'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import { sortStudiesByType } from '../../../object-student'
import styled from 'styled-components'
import Button from '../../components/button'
import Icon from '../../components/icon'
import { iosTrashOutline, iosArrowForward } from '../../icons/ionicons'

const Container = styled.li`
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;

    & + & {
        border-top: ${props => props.theme.materialDivider};
    }

    border-left: solid 3px transparent;
    &.loading {
        border-left-color: ${props => props.theme.blue300};
    }
    &.can-graduate {
        border-left-color: ${props => props.theme.green300};
    }
    &.cannot-graduate {
        border-left-color: ${props => props.theme.red300};
    }
`

const DeleteButton = styled(Button)`
    flex-direction: column;
    padding: 0.5em 1em;
    font-size: 0.9em;
    border: 0;
    border-radius: 0;

    & .icon {
        font-size: 2em;
        margin-bottom: 0.125em;
    }

    &:hover {
        color: white;
        border-color: $red-900;
        background-color: $red-500;
    }
`

const GoIcon = styled(Icon)`
    margin-left: 1em;
    margin-right: 0.5em;
`

const StudentName = styled.div`
    line-height: 1.5;
`

const StudentAreas = styled.div`
    font-size: 0.8em;
`

const AreaGrouping = styled.span`
    & + &::before { content: " | "; }
`

const AreaName = styled.span`
    & + &::before { content: " • "; }
`

const StudentInfo = styled.span`
    flex: 1;
    margin-left: 0.5em;
`

const ListItemLink = styled(Link)`
    ${props => props.theme.linkUndecorated}

    background-color: white;
    &.is-selected {
        background-color: ${props => props.theme.blue50};
    }

    flex: 1;
    display: flex;
    align-items: center;

    padding: 0.75em 0.5em;
    position: relative;

    transition: 0.15s;

    cursor: pointer;

    &:hover,
    &:focus {
        outline: none;
        background-color: ${props => props.theme.blue50};
        border-color: ${props => props.theme.blue};
    }
`

type PropTypes = {
    destroyStudent: (string) => any,
    isEditing: boolean,
    student: Object,
};

export default function StudentListItem(props: PropTypes) {
    const { student, isEditing, destroyStudent } = props

    const isLoading =
        student.isLoading ||
        student.isFetching ||
        student.isValdiating ||
        student.isChecking

    const classes: any = { loading: isLoading }
    if (!isLoading) {
        classes['can-graduate'] = student.data.present.canGraduate
        classes['cannot-graduate'] = !student.data.present.canGraduate
    }

    const sortedStudies = sortStudiesByType(student.data.present.studies)
    const groupedStudies = groupBy(sortedStudies, s => s.type)

    const areas = map(groupedStudies, (group, type) => (
        <AreaGrouping key={type}>
            {group.map(s => <AreaName key={s.name}>{s.name}</AreaName>)}
        </AreaGrouping>
    ))

    return (
        <Container className={cx(classes)}>
            {isEditing &&
                <DeleteButton
                    type="flat"
                    onClick={() => destroyStudent(student.data.present.id)}
                >
                    <Icon>{iosTrashOutline}</Icon>
                    Delete
                </DeleteButton>}
            <ListItemLink to={`/s/${student.data.present.id}/`}>
                <StudentInfo>
                    <StudentName>
                        {student.data.present.name}
                        {process.env.NODE_ENV !== 'production'
                            ? ` (${student.data.present.id})`
                            : ''}
                    </StudentName>
                    <StudentAreas>
                        {areas}
                    </StudentAreas>
                </StudentInfo>

                <GoIcon>{iosArrowForward}</GoIcon>
            </ListItemLink>
        </Container>
    )
}

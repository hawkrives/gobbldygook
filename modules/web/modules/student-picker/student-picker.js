// @flow
import React from 'react'
import size from 'lodash/size'

import {
    androidSearch,
    funnel,
    androidApps,
    androidMenu,
    androidAdd,
} from '../../icons/ionicons'
import Toolbar from '../../components/toolbar'
import Button from '../../components/button'
import Icon from '../../components/icon'
import StudentList from './student-list'
import styled from 'styled-components'

const StudentListToolbar = styled(Toolbar)`
    width: 100%;
    justify-content: center;
`

const StudentListButton = styled(Button)`
    padding-left: 0.5em !important;
    padding-right: 0.5em !important;
    margin: 0 0.125em;
    flex-direction: column;
    flex: 0 1 auto !important;

    & .icon {
        font-size: 1.5em;
        margin-bottom: 0.25em;
    }
`

const Overview = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 45em;
    margin: 0 auto;
`

const StudentListToolbarWrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 1em;
`

const AppTitle = styled.header`
    margin-top: 3em;
    text-align: center;

    & h1, & h2 {
        margin: 0;
        font-feature-settings: 'smcp';
    }

    & h1 {
        font-weight: 300;
    }

    & h2 {
        margin-bottom: 1em;
        font-weight: 400;
        font-size: 1em;
    }
`

const MakeStudentButton = styled(Button)`
    max-width: 10em;
    margin: 0 auto;
`

const Filter = styled.input`
    ${props => props.theme.card}
    flex: 3 0 auto;
    align-self: center;
    padding: 0.25em 0.5em;
    margin-right: 1em;
    margin-left: 1em; /* only for the search button */

    &:focus {
        color: $blue-900;
        border-color: $blue-500;
        background-color: $blue-50;
        outline: none;
    }
`

let sortByExpanded = {
    dateLastModified: 'date last modified',
    name: 'name',
    canGraduate: 'can graduate',
}

type PropTypes = {
    destroyStudent: () => any,
    filterText: string,
    groupBy: string,
    isEditing: boolean,
    onFilterChange: () => any,
    onGroupChange: () => any,
    onSortChange: () => any,
    onToggleEditing: () => any,
    sortBy: string,
    students: Object,
}

export default function StudentPicker(props: PropTypes) {
    const {
        destroyStudent,
        filterText,
        groupBy,
        isEditing,
        onFilterChange,
        onGroupChange,
        onSortChange,
        onToggleEditing,
        sortBy,
        students,
    } = props

    return (
        <Overview>
            <AppTitle>
                <h1>GobbldygooK</h1>
                <h2>A Course Scheduling Helper</h2>
                <small><code>{COMMIT_HASH}</code></small>
            </AppTitle>

            <StudentListToolbarWrapper>
                <StudentListToolbar>
                    <StudentListButton link to="search/">
                        <Icon>{androidSearch}</Icon>
                        Courses
                    </StudentListButton>

                    <Filter
                        type="search"
                        placeholder="Filter students"
                        value={filterText}
                        onChange={onFilterChange}
                    />

                    <StudentListButton onClick={onSortChange}>
                        <Icon>{funnel}</Icon>
                        Sort
                    </StudentListButton>

                    <StudentListButton disabled onClick={onGroupChange}>
                        <Icon>{androidApps}</Icon>
                        Group
                    </StudentListButton>

                    <StudentListButton onClick={onToggleEditing}>
                        <Icon>{androidMenu}</Icon>
                        Edit
                    </StudentListButton>

                    <StudentListButton link to="create/">
                        <Icon>{androidAdd}</Icon>
                        New
                    </StudentListButton>
                </StudentListToolbar>

                <div>
                    <span>
                        Sorting by <b>{sortByExpanded[sortBy]}</b> (a-z);
                    </span>
                    {' '}
                    <span>grouping by <b>{groupBy}</b>.</span>
                </div>
            </StudentListToolbarWrapper>

            {size(students) > 0
                ? <StudentList
                      destroyStudent={destroyStudent}
                      filter={filterText}
                      isEditing={isEditing}
                      sortBy={sortBy}
                      groupBy={groupBy}
                      students={students}
                  />
                : <MakeStudentButton link type="raised" to="/create">
                      Add a Student
                  </MakeStudentButton>}
        </Overview>
    )
}

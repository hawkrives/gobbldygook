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
import './student-picker.scss'

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
};

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
        <div className="students-overview">
            <heading className="app-title">
                <h1>GobbldygooK</h1>
                <h2>A Course Scheduling Helper</h2>
            </heading>

            <div className="student-list-toolbar">
                <StudentListToolbar>
                    <StudentListButton link to="search/">
                        <Icon>{androidSearch}</Icon>
                        Courses
                    </StudentListButton>

                    <input
                        type="search"
                        className="student-list-filter"
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
            </div>

            {size(students) > 0
                ? <StudentList
                      destroyStudent={destroyStudent}
                      filter={filterText}
                      isEditing={isEditing}
                      sortBy={sortBy}
                      groupBy={groupBy}
                      students={students}
                  />
                : <Button
                      className="make-student"
                      link
                      type="raised"
                      to="/create"
                  >
                      Add a Student
                  </Button>}
        </div>
    )
}

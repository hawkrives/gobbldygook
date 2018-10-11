// @flow
import React from 'react'
import {Link} from '@reach/router'
import * as theme from '../../theme'
import {
	androidSearch,
	funnel,
	androidApps,
	androidMenu,
	androidAdd,
} from '../../icons/ionicons'
import {Toolbar} from '../../components/toolbar'
import {FlatButton, RaisedButton} from '../../components/button'
import {Icon} from '../../components/icon'
import StudentList from './student-list'
import styled from 'styled-components'
import {AppTitle} from '../../components/app-title'
import type {State as StudentState} from '../../redux/students/reducers'

import {type SORT_BY_ENUM} from './types'

const StudentListToolbar = styled(Toolbar)`
	width: 100%;
	justify-content: center;
`

const StudentListButton = styled(FlatButton)`
	padding-left: 0.5em !important;
	padding-right: 0.5em !important;
	margin: 0 0.125em;
	flex-direction: column;
	flex: 0 1 auto !important;

	${Icon} {
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

const MakeStudentButton = styled(RaisedButton)`
	max-width: 10em;
	margin: 0 auto;
`

const FilterBox = styled.input`
	${theme.card};
	border: 0;
	flex: 3 0 auto;
	align-self: center;
	padding: 0.25em 0.5em;
	margin-right: 1em;
	margin-left: 1em; /* only for the search button */

	&:focus {
		color: var(--blue-900);
		border-color: var(--blue-500);
		background-color: var(--blue-50);
		outline: none;
	}
`

let sortByExpanded: {[key: SORT_BY_ENUM]: string} = {
	dateLastModified: 'date last modified',
	name: 'name',
}

type PropTypes = {
	destroyStudent: string => mixed,
	filterText: string,
	groupBy: string,
	isEditing: boolean,
	onFilterChange: (SyntheticInputEvent<HTMLInputElement>) => mixed,
	onGroupChange: () => mixed,
	onSortChange: () => mixed,
	onToggleEditing: () => mixed,
	sortBy: SORT_BY_ENUM,
	students: StudentState,
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
			<AppTitle />

			<StudentListToolbarWrapper>
				<StudentListToolbar>
					<StudentListButton as={Link} to="/search">
						<Icon block>{androidSearch}</Icon>
						Courses
					</StudentListButton>

					<FilterBox
						type="search"
						placeholder="Filter students"
						value={filterText}
						onChange={onFilterChange}
					/>

					<StudentListButton onClick={onSortChange}>
						<Icon block>{funnel}</Icon>
						Sort
					</StudentListButton>

					<StudentListButton disabled onClick={onGroupChange}>
						<Icon block>{androidApps}</Icon>
						Group
					</StudentListButton>

					<StudentListButton onClick={onToggleEditing}>
						<Icon block>{androidMenu}</Icon>
						Edit
					</StudentListButton>

					<StudentListButton as={Link} to="/create">
						<Icon block>{androidAdd}</Icon>
						New
					</StudentListButton>
				</StudentListToolbar>

				<div>
					<span>
						Sorting by <b>{sortByExpanded[sortBy]}</b> (a-z);
					</span>{' '}
					<span>
						grouping by <b>{groupBy}</b>.
					</span>
				</div>
			</StudentListToolbarWrapper>

			{Object.keys(students).length > 0 ? (
				<StudentList
					destroyStudent={destroyStudent}
					filter={filterText}
					isEditing={isEditing}
					sortBy={sortBy}
					groupBy={groupBy}
					students={students}
				/>
			) : (
				<MakeStudentButton as={Link} to="create/">
					Add a Student
				</MakeStudentButton>
			)}
		</Overview>
	)
}

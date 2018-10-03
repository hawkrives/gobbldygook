// @flow

import React from 'react'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import fuzzysearch from 'fuzzysearch'
import styled from 'styled-components'
import List from '../../components/list'
import StudentListItem from './student-list-item'
import * as theme from '../../theme'
import {type SORT_BY_ENUM} from './types'
import type {ReduxStudentStore} from '../student/student'

const ListOfStudents = styled(List)`
	${theme.card};
	max-width: 35em;
	width: 100%;
	margin: 0 auto;
	overflow: hidden;
`

type Props = {
	destroyStudent: string => mixed,
	filter: string,
	groupBy: string,
	isEditing: boolean,
	sortBy: SORT_BY_ENUM,
	students: {[key: string]: ReduxStudentStore},
}

export default function StudentList(props: Props) {
	const {isEditing, destroyStudent, students} = props

	let {
		filter: filterText,
		sortBy: sortByKey,
		// groupBy: groupByKey,
	} = props

	filterText = filterText.toLowerCase()
	let filtered = filter(students, s =>
		fuzzysearch(filterText, (s.data.present.name || '').toLowerCase()),
	)

	const studentObjects = sortBy(filtered, s => {
		switch (sortByKey) {
			case 'name':
				return s.data.present.name
			case 'dateLastModified':
				return s.data.present.dateLastModified
			default:
				;(sortByKey: empty)
		}
	}).map((student, i) => (
		<StudentListItem
			key={student.data.present.id || i}
			as="li"
			student={student}
			destroyStudent={destroyStudent}
			isEditing={isEditing}
		/>
	))

	return <ListOfStudents type="plain">{studentObjects}</ListOfStudents>
}

StudentList.defaultProps = {
	filter: '',
	students: {},
}

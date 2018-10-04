// @flow

import React from 'react'
import fuzzysearch from 'fuzzysearch'
import styled from 'styled-components'
import List from '../../components/list'
import StudentListItem from './student-list-item'
import * as theme from '../../theme'
import {type SORT_BY_ENUM} from './types'
import {Map} from 'immutable'
import type {State as StudentState} from '../../redux/students/reducers'

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
	students: StudentState,
}

export default function StudentList(props: Props) {
	const {isEditing, destroyStudent, students} = props

	let {
		filter: filterText,
		sortBy: sortByKey,
		// groupBy: groupByKey,
	} = props

	filterText = filterText.toLowerCase()
	let filtered = Map(students)
		.filter(s =>
			fuzzysearch(filterText, (s.present.name || '').toLowerCase()),
		)
		.toList()
		.sortBy(s => {
			switch (sortByKey) {
				case 'name':
					return s.present.name
				case 'dateLastModified':
					return s.present.dateLastModified
				default:
					;(sortByKey: empty)
			}
		})
		.map((student, i) => (
			<StudentListItem
				key={student.present.id || i}
				as="li"
				student={student}
				destroyStudent={destroyStudent}
				isEditing={isEditing}
			/>
		))

	return <ListOfStudents type="plain">{[...filtered]}</ListOfStudents>
}

StudentList.defaultProps = {
	filter: '',
	students: {},
}

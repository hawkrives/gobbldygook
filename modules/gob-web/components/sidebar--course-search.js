// @flow

import React from 'react'
import {CourseSearcher} from '../modules/course-searcher'
import CourseRemovalBox from '../components/course-removal-box'
import {Sidebar} from './sidebar'
import {Student} from '@gob/object-student'
import type {Undoable} from '../types'

type Props = {
	term: ?string,
	navigate: string => mixed,
	student: Undoable<Student>,
	queryString?: string,
}

export function CourseSearcherSidebar(props: Props) {
	let {student, navigate, queryString = window.location.search} = props

	let {term} = props

	let boundCloseModal = term
		? () => {
				let params = new URLSearchParams(queryString)
				params.delete('term')
				navigate(`/student/${student.present.id}?${params.toString()}`)
		  }
		: null
	term = term ? parseInt(term, 10) : null

	return (
		<Sidebar>
			<CourseRemovalBox student={student.present} />
			<CourseSearcher
				studentId={student.present.id}
				term={term}
				onCloseSearcher={boundCloseModal}
			/>
		</Sidebar>
	)
}

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
}

export function CourseSearcherSidebar(props: Props) {
	let {student} = props

	let {term} = props
	term = term ? parseInt(term, 10) : null

	return (
		<Sidebar>
			<CourseRemovalBox student={student.present} />
			<CourseSearcher
				studentId={student.present.id}
				term={term}
			/>
		</Sidebar>
	)
}

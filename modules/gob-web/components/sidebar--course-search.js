// @flow

import React from 'react'
import {CourseSearcher} from '../modules/course-searcher'
import CourseRemovalBox from '../components/course-removal-box'
import {ConnectedSidebarToolbar} from './sidebar'
import type {HydratedStudentType} from '@gob/object-student'
import type {Undoable} from '../types'

type Props = {
	term: ?string,
	navigate: string => mixed,
	student: Undoable<HydratedStudentType>,
}

export function CourseSearcherSidebar(props: Props) {
	let {student, navigate} = props

	let boundCloseModal = () => {
		navigate('../')
	}

	let {term} = props
	term = term ? parseInt(term, 10) : null

	return (
		<aside>
			<ConnectedSidebarToolbar student={props.student} />
			<CourseRemovalBox studentId={student.present.id} />
			<CourseSearcher
				onCloseSearcher={boundCloseModal}
				studentId={student.present.id}
				term={term}
			/>
		</aside>
	)
}

// @flow

import React from 'react'
import {CourseSearcher} from '../modules/course-searcher'

type Props = {
	term: ?string,
	navigate: string => mixed,
	studentId: string,
}

function CourseSearcherSidebar(props: Props) {
	let {studentId, navigate} = props

	let boundCloseModal = () => {
		navigate('../')
	}

	let {term} = props
	term = term ? parseInt(term, 10) : null

	return (
		<CourseSearcher
			onCloseSearcher={boundCloseModal}
			studentId={studentId}
			term={term}
		/>
	)
}

export default CourseSearcherSidebar

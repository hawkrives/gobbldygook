// @flow

import React from 'react'
import CourseSearcher from '../modules/course-searcher'

type Props = {
	term: ?string,
	navigate: string => mixed,
	studentId: string,
	queryString?: string,
}

function CourseSearcherSidebar(props: Props) {
	let {studentId, navigate, queryString = window.location.search} = props

	let boundCloseModal = () => {
		let params = new URLSearchParams(queryString)
		params.delete('search')
		navigate(params.toString())
	}

	let {term} = props
	if (term) {
		term = parseInt(term, 10)
	}

	return (
		<CourseSearcher
			closeSearcher={boundCloseModal}
			studentId={studentId}
			term={term}
		/>
	)
}

export default CourseSearcherSidebar

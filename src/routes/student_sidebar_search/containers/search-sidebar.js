import React, {PropTypes} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import CourseSearcher from 'src/containers/course-searcher'

export default function CourseSearcherSidebar(props) {
	const {studentId} = props.params
	const boundCloseModal = () => props.push({pathname: `/s/${studentId}`})

	let {year, semester} = props.params
	if (year) {
		year = parseInt(year, 10)
	}
	if (semester) {
		semester = parseInt(semester, 10)
	}

	return <CourseSearcher
		closeSearcher={boundCloseModal}
		studentId={props.params.studentId}
		partial={{year, semester}}
	/>
}

CourseSearcherSidebar.propTypes = {
	params: PropTypes.shape({
		studentId: PropTypes.string.isRequired,
		semester: PropTypes.string,
		year: PropTypes.string,
	}).isRequired, // router
	push: PropTypes.func.isRequired, // redux
}

const mapDispatchToProps = dispatch => bindActionCreators({push}, dispatch)

export default connect(undefined, mapDispatchToProps)(CourseSearcherSidebar)

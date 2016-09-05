import React, {PropTypes} from 'react'
import withRouter from 'react-router/lib/withRouter'
import CourseSearcher from 'src/containers/course-searcher'

function CourseSearcherSidebar(props) {
	const {studentId} = props.params
	const boundCloseModal = () => props.router.push({pathname: `/s/${studentId}`})

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
	router: PropTypes.object.isRequired, // redux
}

export default withRouter(CourseSearcherSidebar)

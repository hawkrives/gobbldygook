import React, {PropTypes} from 'react'
import Course from '../components/course'
import Loading from '../../../components/loading'

export default function courseContainer(props) {
	if (props.course) {
		return <Course {...this.props} />
	}
	return <Loading>Loading Course…</Loading>
}

courseContainer.propTypes = {
	course: PropTypes.object.isRequired,
}

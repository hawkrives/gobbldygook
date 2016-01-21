import React, {Component, PropTypes} from 'react'
import Course from '../components/course'
import Loading from '../../../components/loading'

export default class CourseContainer extends Component {
	render() {
		if (this.props.course) {
			return <Course {...this.props} />
		}
		return <Loading>Loading Course…</Loading>
	}
}

CourseContainer.propTypes = {
	course: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
}

import React, {Component, PropTypes} from 'react'
import FakeCourse from './fake-course'

export default class MissingCourse extends Component {
	static propTypes = {
		clbid: PropTypes.number.isRequired,
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]).isRequired,
	};

	render() {
		return (<FakeCourse
			title={`Cannot load course ${this.props.clbid}`}
			details={String(this.props.error)}
			className='missing'
		/>)
	}
}

import React, {Component, PropTypes} from 'react'
import FakeCourse from './fake-course'

export default class MissingCourse extends Component {
	static propTypes = {
		clbid: PropTypes.number.isRequired,
	}

	render() {
		return <FakeCourse title={`Cannot load course ${this.props.clbid}`} className='missing' />
	}
}

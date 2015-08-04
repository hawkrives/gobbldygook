import React, {Component} from 'react'
import FakeCourse from './fake-course'

export default class MissingCourse extends Component {
	render() {
		return <FakeCourse title='Missing Slot' className='missing' />
	}
}

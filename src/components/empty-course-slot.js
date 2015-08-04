import React, {Component} from 'react'
import FakeCourse from './fake-course'

class EmptyCourseSlot extends Component {
	render() {
		// console.log('EmptyCourseSlot#render')
		return <FakeCourse title='Empty Slot' className='empty' />
	}
}

export default EmptyCourseSlot

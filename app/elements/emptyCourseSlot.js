import React from 'react'
import FakeCourse from './fakeCourse'

class EmptyCourseSlot extends React.Component {
	render() {
		console.log('EmptyCourseSlot#render')
		return <FakeCourse title='Empty Slot' className='empty' />
	}
}

export default EmptyCourseSlot

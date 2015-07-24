import React from 'react'
import FakeCourse from './fakeCourse'

export default class MissingCourse extends React.Component {
	render() {
		// console.log('MissingCourse#render')
		return <FakeCourse title='Missing Slot' className='missing' />
	}
}

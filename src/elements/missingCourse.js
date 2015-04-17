import React from 'react'
import FakeCourse from './fakeCourse'

let MissingCourse = React.createClass({
	render() {
		// console.log('MissingCourse#render')
		return <FakeCourse title='Missing Slot' className='missing' />
	}
})

export default MissingCourse

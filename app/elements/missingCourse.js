import React from 'react'
import FakeCourse from 'app/components/fakeCourse'

let MissingCourse = React.createClass({
	render() {
		return React.createElement(FakeCourse, {title: 'Missing Slot', className: 'missing'})
	}
})

export default MissingCourse

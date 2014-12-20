import * as React from 'react'
import {State, RouteHandler} from 'react-router'

import Sidebar from 'elements/sidebar'

var Student = React.createClass({
	mixins: [State],
	render() {
		console.info('student render', this.props.students.toJS())
		let queryId = this.getParams().id
		let student = this.props.students.find((student) => student.id === queryId)

		window.stu = student

		return React.createElement('div',
			{className: 'student'},
			React.createElement(Sidebar, {student}),
			React.createElement(RouteHandler, {student}))
	},
})

export default Student

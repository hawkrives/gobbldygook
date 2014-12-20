import * as React from 'react'
import {State, RouteHandler} from 'react-router'

import Sidebar from 'elements/sidebar'

var Student = React.createClass({
	mixins: [State],
	render() {
		console.info('student render', this.props.students)
		let queryId = this.getQuery().id
		let student = this.props.students.find((student) => student.id === queryId)

		return React.createElement('div',
			{className: 'student'},
			React.createElement(Sidebar, {student}),
			React.createElement(RouteHandler, {student}))
	},
})

export default Student

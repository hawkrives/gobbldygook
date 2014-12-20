import * as React from 'react'
import {Link} from 'react-router'

var StudentList = React.createClass({
	render() {
		let students = this.props.students.map((student) =>
			React.createElement(Link, {to: 'student', params: {id: student.id}}, React.createElement('li', null, student.name)))

		return React.createElement('div',
			{className: 'student-list'},
			React.createElement('ul', null, students)
		)
	}
})

export default StudentList

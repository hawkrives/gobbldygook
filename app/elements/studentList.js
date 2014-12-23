import * as React from 'react'
import {Link} from 'react-router'

var StudentList = React.createClass({
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.students !== this.props.students
	},

	render() {
		let students = this.props.students.map((student) =>
			React.createElement('li', {key: student.id, className: 'student-list--student'},
				React.createElement(Link,
					{to: 'student', params: {id: student.id}},
					student.name)))

		return React.createElement('ul', {className: 'student-list'}, students.toJS())
	},
})

export default StudentList

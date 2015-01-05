import * as React from 'react'
import {Link} from 'react-router'

let StudentList = React.createClass({
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.students !== this.props.students
	},

	render() {
		let students = this.props.students.map((student) =>
			React.createElement('li', {key: student.id},
				React.createElement(Link,
					{className: 'student-list--student', to: 'student', params: {id: student.id}},
					student.name)))

		return React.createElement('ul', {className: 'student-list'}, students.toJS())
	},
})

export default StudentList

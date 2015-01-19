import React from 'react'
import {Link} from 'react-router'
import studentActions from '../flux/studentActions'

let StudentList = React.createClass({
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.students !== this.props.students
	},

	render() {
		let students = this.props.students
			.map((student) =>
				React.createElement('li', {key: student.id},
					React.createElement(Link,
						{
							className: 'student-list--student',
							to: 'student',
							params: {id: student.id},
						},
						student.name)))
			.toList()

		// students = students.push(React.createElement('li', {key: 'new-student'},
		// 	React.createElement(Link,
		// 		{
		// 			className: 'student-list--student',
		// 			to: 'add-student',
		// 		},
		// 		'Add Student')))
		students = students.push(React.createElement('li', {key: 'new-student'},
			React.createElement('button',
				{
					className: 'student-list--student',
					onClick: studentActions.initStudent,
				},
				'Add Student')))

		return React.createElement('ul', {className: 'student-list'}, students.toJS())
	},
})

export default StudentList

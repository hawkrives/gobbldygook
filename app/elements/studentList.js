import React from 'react'
import {Link} from 'react-router'
import studentActions from 'app/flux/studentActions'

let StudentList = React.createClass({
	handleSubmit(ev) {
		ev.preventDefault()
	},

	// since we are starting off without any data, there is no initial value
	getInitialState() {
		return {
			data: null,
		}
	},

	// when a file is passed to the input field, retrieve the contents as a
	// base64-encoded data URI and save it to the component's state
	handleFile(ev) {
		var reader = new FileReader()
		var file = ev.target.files[0]

		reader.onload = (upload) => {
			studentActions.importStudent(upload.target.result)
		}

		reader.readAsText(file)
	},

	render() {
		let students = this.props.students
			.map((student) =>
				React.createElement('li', {key: student.id},
					React.createElement(Link, {
						to: 'student',
						params: {id: student.id},
					}, student.name)))
			.toList()

		let buttons = [
			React.createElement('button', {
				key: 'create-student',
				className: 'create-student',
				onClick: studentActions.initStudent,
			}, 'Add Student'),

			React.createElement('input', {
				type: 'file',
				accept: '.json',
				key: 'import-student',
				className: 'import-student',
				onSubmit: this.handleSubmit,
				onChange: this.handleFile,
			}),
		]

		return React.createElement('div', {className: 'students-overview'},
			React.createElement('ul', {className: 'student-list'}, students.toJS()),
			React.createElement('div', {className: 'student-buttons'}, buttons))
	},
})

export default StudentList

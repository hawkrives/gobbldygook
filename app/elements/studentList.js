import React from 'react'
import {Link} from 'react-router'
import studentActions from '../flux/studentActions'

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
		let studentObjects = this.props.students
			.toList()
			.sortBy(s => s.name)
			.map((student) => React.createElement('li', null,
				React.createElement(Link, {
					key: student.id,
					className: 'student-list-item',
					params: {id: student.id},
					to: 'student',
				}, [
					React.createElement('span', {key: 'letter', className: 'letter'}, student.name.length ? student.name[0] : ''),
					React.createElement('span', {key: 'name', className: 'name'}, student.name || 'Student'),
					// React.createElement('span', {className: 'status', student.name || 'Student'}),
				])))

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

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
			.toJS()

		let buttons = React.createElement('menu', {className: 'student-buttons'}, [
			React.createElement('button'/*DropdownMenu*/, {
				key: 'student-button--sort-by',
				className: 'student-button--sort-by',
				items: [
					'First Name',
					'Last Name',
					'Date Modified',
					'Date Created',
					'Graduation Year',
				],
			}, 'Sort'),

			React.createElement('button'/*DropdownMenu*/, {
				key: 'student-button--group-by',
				className: 'student-button--group-by',
				items: [
					'None',
					'Area',
					'Graduatability',
					'Graduation Year',
				],
			}, 'Group'),

			React.createElement('button', {
				key: 'student-button--edit',
				className: 'student-button--edit',
				onClick: this.editList,
			}, 'Edit'),

			React.createElement('button', {
				key: 'student-button--new',
				className: 'student-button--new',
				onClick: studentActions.initStudent,
			}, 'New'),

			// React.createElement('input', {
			// 	type: 'file',
			// 	accept: '.json',
			// 	key: 'import-student',
			// 	className: 'import-student',
			// 	onSubmit: this.handleSubmit,
			// 	onChange: this.handleFile,
			// }),
		])

		let studentFilter = React.createElement('input', {
			className: 'student-filter',
			placeholder: 'Filter students',
		})

		let toolbar = React.createElement('div', {className: 'student-toolbar'},
			studentFilter, buttons)

		let students = React.createElement('ol', {className: 'student-list'},
			studentObjects)

		return React.createElement('div', {className: 'students-overview'},
			toolbar, students)
	},
})

export default StudentList

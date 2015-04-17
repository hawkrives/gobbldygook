import React from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'
import studentActions from '../flux/studentActions'

class StudentList extends React.Component {
	constructor(props) {
		super(props)
		// since we are starting off without any data, there is no initial value
		this.state = {
			data: null,
		}
	}

	handleSubmit(ev) {
		ev.preventDefault()
	}

	// when a file is passed to the input field, retrieve the contents as a
	// base64-encoded data URI and save it to the component's state
	handleFile(ev) {
		let reader = new FileReader()
		let file = ev.target.files[0]

		reader.onload = (upload) => {
			studentActions.importStudent(upload.target.result)
		}

		reader.readAsText(file)
	}

	render() {
		// console.log('StudentList#render')
		let studentObjects = this.props.students
			.toList()
			.sortBy(s => s.dateLastModified)
			.map((student) => <li key={student.id}>
				<Link className='student-list-item' to='student' params={{id: student.id}}>
					<span key='letter' className='letter'>{student.name.length ? student.name[0] : ''}</span>
					<span key='name' className='name'>{student.name || 'Student'}</span>
				</Link></li>)
			.toJS()

		let buttons = <menu className='student-list-buttons'>
			<button key='student-list-button--sort-by'
				className='student-list-button--sort-by'
				items={[
					'First Name',
					'Last Name',
					'Date Modified',
					'Date Created',
					'Graduation Year',
				]}>Sort</button>

			<button key='student-list-button--group-by'
				className='student-list-button--group-by'
				items={[
					'None',
					'Area',
					'Graduatability',
					'Graduation Year',
				]}>Group</button>

			<button key='student-list-button--edit'
				className='student-list-button--edit'
				onClick={this.editList}>Edit</button>

			<button key='student-list-button--new'
				className='student-list-button--new'
				onClick={studentActions.initStudent}>New</button>
		</menu>

		let importButton = <input type='file'
			accept='.json'
			key='import-student'
			className='import-student'
			onSubmit={this.handleSubmit}
			onChange={this.handleFile} />

		let studentFilter = <input type='search'
			className='student-list-filter'
			placeholder='Filter students' />

		let toolbar = <div className='student-list-toolbar'>
			{studentFilter}{buttons}
		</div>

		let students = <ol className='student-list'>
			{studentObjects}
		</ol>

		return <div className='students-overview'>
			{importButton}
			{toolbar}
			{students}
		</div>
	}
}

StudentList.propTypes = {
	students: React.PropTypes.instanceOf(Immutable.Map).isRequired,
}

export default StudentList

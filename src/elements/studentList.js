import React from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'
import studentActions from '../flux/studentActions'
import fuzzysearch from 'fuzzysearch'

export default class StudentList extends React.Component {
	static propTypes = {
		students: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)

		// since we are starting off without any data, there is no initial value
		this.state = {
			data: null,
			studentFilter: '',
			isEditing: false,
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
			studentActions.importStudent({
				data: upload.target.result,
				type: file.type,
			})
		}

		reader.readAsText(file)
	}

	render() {
		// console.log('StudentList#render')
		let studentObjects = this.props.students
			.toList()
			.filter(s => fuzzysearch(this.state.studentFilter, s.name.toLowerCase()))
			.sortBy(s => s.dateLastModified)
			.map(student =>
				<li key={student.id}>
					<Link
						className='student-list-item'
						to='student'
						params={{id: student.id}}
						onClick={(ev) => {
							if (this.state.isEditing) {
								ev.preventDefault()
								studentActions.destroyStudent(student.id)
							}
						}}>
						{
							this.state.isEditing
								? <span className='delete'>×</span>
								: <span className='letter'>{student.name.length ? student.name[0] : ''}</span>
						}
						<span className='name'>{student.name || ''}</span>
					</Link>
				</li>)
			.toArray()

		return (
			<div className='students-overview'>
				<input
					className='import-student'
					type='file'
					accept='.json,.html'
					onSubmit={this.handleSubmit}
					onChange={this.handleFile} />

				<div className='student-list-toolbar'>
					<input
						type='search'
						className='student-list-filter'
						placeholder='Filter students'
						onChange={ev => this.setState({studentFilter: ev.target.value.toLowerCase()})} />

					<menu className='student-list-buttons'>
						<button className='student-list-button--sort-by'>Sort</button>

						<button className='student-list-button--group-by'>Group</button>

						<button
							className='student-list-button--edit'
							onClick={() => this.setState({isEditing: !this.state.isEditing})}>Edit</button>

						<button
							className='student-list-button--new'
							onClick={studentActions.initStudent}>New</button>
					</menu>
				</div>

				<ol className='student-list'>
					{studentObjects}
				</ol>
			</div>
		)
	}
}

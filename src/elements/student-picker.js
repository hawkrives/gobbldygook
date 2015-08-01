import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import studentActions from '../flux/studentActions'
import Button from './button'
import Icon from './icon'
import StudentList from './studentList'

export default class StudentPicker extends Component {
	static propTypes = {
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)

		// since we are starting off without any data, there is no initial value
		this.state = {
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
						<Button className='student-list--button'>
							<Icon name='ionicon-funnel' type='block' />
							Sort
						</Button>

						<Button className='student-list--button'>
							<Icon name='ionicon-folder' type='block' />
							Group
						</Button>

						<Button className='student-list--button'
							onClick={() => this.setState({isEditing: !this.state.isEditing})}>
							<Icon name='ionicon-navicon' type='block' />
							Edit
						</Button>

						<Button className='student-list--button'
							onClick={studentActions.initStudent}>
							<Icon name='ionicon-plus' type='block' />
							New
						</Button>
					</menu>
				</div>

				<StudentList
					isEditing={this.state.isEditing}
					students={this.props.students}
					filter={this.state.studentFilter} />
			</div>
		)
	}
}

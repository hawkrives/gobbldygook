import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'

import studentActions from '../flux/student-actions'

import Button from '../components/button'
import Icon from '../components/icon'
import StudentList from '../components/student-list'

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
			sortBy: 'modified',
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

		reader.onload = upload => {
			studentActions.importStudent({
				data: upload.target.result,
				type: file.type,
			})
		}

		reader.readAsText(file)
	}

	render() {
		// console.log('StudentPicker#render')
		return (
			<div className='students-overview'>
				<input
					className='import-student'
					type='file'
					accept='.json,.html'
					onSubmit={this.handleSubmit}
					onChange={this.handleFile} />

				<div className='student-list-toolbar'>
					<menu className='student-list-buttons'>
						<Button className='student-list--button'
							onClick={() => this.setState({sortBy: this.state.sortBy === 'modified' ? 'name' : 'modified'})}>
							<Icon name='ionicon-funnel' type='inline' />{' '}
							Sort by: {this.state.sortBy}
						</Button>

						<Button className='student-list--button'>
							<Icon name='ionicon-folder' type='inline' />{' '}
							Group by: {'nothing'}
						</Button>

						<Button className='student-list--button'
							onClick={() => this.setState({isEditing: !this.state.isEditing})}>
							<Icon name='ionicon-navicon' type='inline' />{' '}
							Edit List
						</Button>

						<Button className='student-list--button'
							onClick={studentActions.initStudent}>
							<Icon name='ionicon-plus' type='inline' />{' '}
							New Student
						</Button>
					</menu>

					<input
						type='search'
						className='student-list-filter'
						placeholder='Filter students'
						onChange={ev => this.setState({studentFilter: ev.target.value.toLowerCase()})}
					/>
				</div>

				<StudentList
					filter={this.state.studentFilter}
					isEditing={this.state.isEditing}
					sortBy={this.state.sortBy}
					students={this.props.students}
				/>
			</div>
		)
	}
}

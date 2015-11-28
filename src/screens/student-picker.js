import React, {Component, PropTypes} from 'react'
import DropZone from 'react-dropzone'
import forEach from 'lodash/collection/forEach'

import Toolbar from '../components/toolbar'
import Button from '../components/button'
import Icon from '../components/icon'
import StudentList from '../components/student-list'

import './student-picker.scss'

export default class StudentPicker extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		students: PropTypes.shape({ // a history object!
			past: PropTypes.arrayOf(PropTypes.object),
			present: PropTypes.object,
			future: PropTypes.arrayOf(PropTypes.object),
		}),
	}

	constructor() {
		super()

		// since we are starting off without any data, there is no initial value
		this.state = {
			studentFilter: '',
			isEditing: false,
			sortBy: 'modified',
		}
	}

	handleDrop = files => {
		forEach(files, file => {
			const reader = new FileReader()

			reader.addEventListener('load', upload => {
				this.props.actions.importStudent({
					data: upload.target.result,
					type: file.type,
				})
			})

			reader.readAsText(file)
		})
	}

	render() {
		// console.log('StudentPicker#render')
		return (
			<div className='students-overview'>
				<heading className='app-title'>
					{/*<OleLion />*/}
					<h1>Gobbldygook</h1>
					<h2>A Course Scheduling Helper</h2>
				</heading>

				<DropZone
					className='import-student'
					activeClassName='import-student-active'
					onDrop={this.handleDrop}
				>
					<p>
						<button>Choose a File</button> or drop a student file here to import it.
					</p>
				</DropZone>

				<div className='student-list-toolbar'>
					<Toolbar className='student-list-buttons'>
						<Button className='student-list--button'
							onClick={() => this.setState({sortBy: this.state.sortBy === 'modified' ? 'name' : 'modified'})}>
							<Icon name='funnel' type='inline' />{' '}
							Sort by: {this.state.sortBy}
						</Button>

						<Button className='student-list--button'>
							<Icon name='folder' type='inline' />{' '}
							Group by: {'nothing'}
						</Button>

						<Button className='student-list--button'
							onClick={() => this.setState({isEditing: !this.state.isEditing})}>
							<Icon name='navicon' type='inline' />{' '}
							Edit List
						</Button>

						<Button className='student-list--button'
							onClick={this.props.actions.initStudent}>
							<Icon name='plus' type='inline' />{' '}
							New Student
						</Button>
					</Toolbar>

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

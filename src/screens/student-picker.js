import React, {Component, PropTypes} from 'react'
import DropZone from 'react-dropzone'
import forEach from 'lodash/collection/forEach'
import noop from 'lodash/utility/noop'

import Toolbar from '../components/toolbar'
import Button from '../components/button'
import Icon from '../components/icon'
import StudentList from '../components/student-list'

import './student-picker.scss'

export function StudentPicker(props) {
	const {
		actions,
		students,
		onSortChange,
		sortBy,
		onGroupChange,
		groupBy,
		onFilterChange,
		filterText,
		onDrop,
		onToggleEditing,
		isEditing,
	} = props

	return (
		<div className='students-overview'>
			<heading className='app-title'>
				<h1>Gobbldygook</h1>
				<h2>A Course Scheduling Helper</h2>
			</heading>

			<DropZone
				className='import-student'
				activeClassName='import-student-active'
				onDrop={onDrop}
			>
				<p>
					<button>Choose a File</button> or drop a student file here to import it.
				</p>
			</DropZone>

			<div className='student-list-toolbar'>
				<Toolbar className='student-list-buttons'>
					<Button className='student-list--button' onClick={onSortChange}>
						<Icon name='funnel' type='inline' />{' '}
						Sort by: {sortBy}
					</Button>

					<Button className='student-list--button' onClick={onGroupChange}>
						<Icon name='folder' type='inline' />{' '}
						Group by: {groupBy}
					</Button>

					<Button className='student-list--button' onClick={onToggleEditing}>
						<Icon name='navicon' type='inline' />{' '}
						Edit List
					</Button>

					<Button className='student-list--button' onClick={actions.initStudent}>
						<Icon name='plus' type='inline' />{' '}
						New Student
					</Button>
				</Toolbar>

				<input
					type='search'
					className='student-list-filter'
					placeholder='Filter students'
					value={filterText}
					onChange={onFilterChange}
				/>
			</div>

			<StudentList
				filter={filterText}
				isEditing={isEditing}
				sortBy={sortBy}
				students={students}
			/>
		</div>
	)
}
StudentPicker.propTypes = {
	actions: PropTypes.object.isRequired,
	filterText: PropTypes.string.isRequired,
	groupBy: PropTypes.string.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onDrop: PropTypes.func.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	onGroupChange: PropTypes.func.isRequired,
	onSortChange: PropTypes.func.isRequired,
	onToggleEditing: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	students: PropTypes.object.isRequired,
}

export default class StudentPickerContainer extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func),
		students: PropTypes.object,
	}

	constructor() {
		super()

		// since we are starting off without any data, there is no initial value
		this.state = {
			filterText: '',
			isEditing: false,
			sortBy: 'modified',
			groupBy: 'nothing',
		}
	}

	onDrop = files => {
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

	onFilterChange = ev => {
		this.setState({filterText: ev.target.value.toLowerCase()})
	}

	onGroupChange = () => {
		noop()
	}

	onSortChange = () => {
		this.setState({sortBy: this.state.sortBy === 'modified' ? 'name' : 'modified'})
	}

	onToggleEditing = () => {
		this.setState({isEditing: !this.state.isEditing})
	}

	render() {
		// console.log('StudentPicker#render')
		return (
			<StudentPicker
				{...this.props}
				filterText={this.state.filterText}
				groupBy={this.state.groupBy}
				isEditing={this.state.isEditing}
				onDrop={this.onDrop}
				onFilterChange={this.onFilterChange}
				onGroupChange={this.onGroupChange}
				onSortChange={this.onSortChange}
				onToggleEditing={this.onToggleEditing}
				sortBy={this.state.sortBy}
			/>
		)
	}
}

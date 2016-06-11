const React = require('react')
const {PropTypes} = React
import {size} from 'lodash-es'

import Toolbar from '../../../components/toolbar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import StudentList from './student-list'

// import './student-picker.css'

let sortByExpanded = {
	dateLastModified: 'date last modified',
	name: 'name',
	canGraduate: 'can graduate',
}

export default function StudentPicker(props) {
	const {
		destroyStudent,
		filterText,
		groupBy,
		isEditing,
		onFilterChange,
		onGroupChange,
		onSortChange,
		onToggleEditing,
		sortBy,
		students,
	} = props

	return (
		<div className='students-overview'>
			<heading className='app-title'>
				<h1>GobbldygooK</h1>
				<h2>A Course Scheduling Helper</h2>
			</heading>

			<div className='student-list-toolbar'>
				<Toolbar className='student-list-buttons'>
					<Button link to='search/' className='student-list--button'>
						<Icon name='android-search' />
						Courses
					</Button>

					<input
						type='search'
						className='student-list-filter'
						placeholder='Filter students'
						value={filterText}
						onChange={onFilterChange}
					/>

					<Button className='student-list--button' onClick={onSortChange}>
						<Icon name='funnel' />
						Sort
					</Button>

					<Button className='student-list--button' onClick={onGroupChange} disabled>
						<Icon name='android-apps' />
						Group
					</Button>

					<Button className='student-list--button' onClick={onToggleEditing}>
						<Icon name='android-menu' />
						Edit
					</Button>

					<Button link to='create/' className='student-list--button'>
						<Icon name='android-add' />
						New
					</Button>
				</Toolbar>

				<div>
					<span>Sorting by <b>{sortByExpanded[sortBy]}</b> (a-z);</span>{' '}
					<span>grouping by <b>{groupBy}</b>.</span>
				</div>
			</div>

			{size(students) > 0 ? <StudentList
				destroyStudent={destroyStudent}
				filter={filterText}
				isEditing={isEditing}
				sortBy={sortBy}
				groupBy={groupBy}
				students={students}
			/> : <Button className='make-student' link type='raised' to='/create'>Add a Student</Button>}
		</div>
	)
}

StudentPicker.propTypes = {
	destroyStudent: PropTypes.func.isRequired,
	filterText: PropTypes.string.isRequired,
	groupBy: PropTypes.string.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	onGroupChange: PropTypes.func.isRequired,
	onSortChange: PropTypes.func.isRequired,
	onToggleEditing: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	students: PropTypes.object.isRequired,
}

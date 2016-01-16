import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import Toolbar from '../../../components/toolbar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import StudentList from './student-list'

import './student-picker.scss'

export default function StudentPicker(props) {
	const {
		destroyStudent,
		filterText,
		groupBy,
		isEditing,
		onAddStudent,
		onFilterChange,
		onGroupChange,
		onOpenSearchOverlay,
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
					<Button className='student-list--button' onClick={onOpenSearchOverlay}>
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

					<Link to={'wizard/'}>
					<Button className='student-list--button' onClick={onAddStudent}>
						<Icon name='android-add' />
						New
					</Button>
					</Link>
				</Toolbar>

				<div>
					<span>Sorting by <b>{sortBy}</b> (a-z);</span>{' '}
					<span>grouping by <b>{groupBy}</b>.</span>
				</div>
			</div>

			<StudentList
				destroyStudent={destroyStudent}
				filter={filterText}
				isEditing={isEditing}
				sortBy={sortBy}
				students={students}
			/>
		</div>
	)
}

StudentPicker.propTypes = {
	destroyStudent: PropTypes.func.isRequired,
	filterText: PropTypes.string.isRequired,
	groupBy: PropTypes.string.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onAddStudent: PropTypes.func.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	onGroupChange: PropTypes.func.isRequired,
	onOpenSearchOverlay: PropTypes.func.isRequired,
	onSortChange: PropTypes.func.isRequired,
	onToggleEditing: PropTypes.func.isRequired,
	sortBy: PropTypes.string.isRequired,
	students: PropTypes.object.isRequired,
}

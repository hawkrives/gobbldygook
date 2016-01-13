import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import values from 'lodash/object/values'
import sortBy from 'lodash/collection/sortBy'
import interpose from '../helpers/interpose'
import fuzzysearch from 'fuzzysearch'

import List from './list'
import Button from './button'
import Icon from './icon'

import './student-list.scss'

class StudentListItem extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		isEditing: PropTypes.bool,
		student: PropTypes.object.isRequired,
	};

	static defaultProps = {
		isEditing: false,
	};

	deleteStudent = ev => {
		ev.preventDefault()
		this.props.actions.destroyStudent(this.props.student.id)
	}

	render() {
		// console.log('StudentListItem#render')
		const { student, isEditing } = this.props
		const groupedStudies = groupBy(student.studies, s => s.type)
		return (
			<li className='student-list-item-container'>
				{isEditing &&
				<Button className='delete' type='flat' onClick={this.deleteStudent}>
					<Icon name='ios-trash-outline' />
					Delete
				</Button>}
				<Link className='student-list-item' to={`/s/${student.id}/`}>
					<span className='student-list-item-info'>
						<div className='name'>{student.name || ''}</div>
						<div className='areas'>
							{map(
								interpose(
									map(groupedStudies, group => group.map(s => s.name).join(' · ')),
									<span className='joiner'>|</span>),
								(group, i) => <span className='area-type' key={i}>{group}</span>)}
						</div>
					</span>

					<Icon className='student-list-item--go' name='ios-arrow-forward' />
				</Link>
			</li>
		)
	}
}


export default class StudentList extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		filter: PropTypes.string,
		isEditing: PropTypes.bool,
		sortBy: PropTypes.oneOf(['modified', 'name']),
		students: PropTypes.object.isRequired,
	};

	static defaultProps = {
		isEditing: false,
		filter: '',
		students: {},
		actions: {},
	};

	render() {
		// console.log('StudentList#render')
		let sortProp = 'dateLastModified'
		if (this.props.sortBy === 'name') {
			sortProp = 'name'
		}

		const { filter: filterText, isEditing, actions } = this.props
		const students = this.props.students

		const studentObjects = map(
				sortBy(
					filter(
						values(students),
						s => fuzzysearch(filterText, s.name.toLowerCase())),
					s => s[sortProp]),
				student =>
					<StudentListItem
						key={student.id}
						student={student}
						actions={actions}
						isEditing={isEditing}
					/>
			)

		return (
			<List className='student-list' type='plain'>
				{studentObjects}
			</List>
		)
	}
}

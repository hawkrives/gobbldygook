import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import values from 'lodash/object/values'
import sortBy from 'lodash/collection/sortBy'
import interpose from '../helpers/interpose'
import fuzzysearch from 'fuzzysearch'

import studentActions from '../flux/student-actions'

import AvatarLetter from './avatar-letter'
import Button from './button'
import List from './list'
import Icon from './icon'

import './student-list.scss'

class StudentListItem extends Component {
	static propTypes = {
		isEditing: PropTypes.bool,
		student: PropTypes.object.isRequired,
	}

	static defaultProps = {
		isEditing: false,
	}

	deleteStudent = ev => {
		ev.preventDefault()
		studentActions.destroyStudent(this.props.student.id)
	}

	render() {
		// console.log('StudentListItem#render')
		const student = this.props.student
		const groupedStudies = groupBy(student.studies, s => s.type)
		return (<span>
			<Link className='student-list-item' to={`/s/${student.id}/`}>
				<AvatarLetter value={student.name} />
				<span className='student-list-item-info'>
					<div className='name'>{student.name || ''}</div>
					<div className='areas'>
						{map(
							interpose(
								map(groupedStudies, group => group.map(s => s.name).join(' · ')),
								<span className='joiner'>※</span>),
							(group, i) => <span className='area-type' key={i}>{group}</span>)}
					</div>
				</span>
				<span className='student-list-item-actions'>
					{this.props.isEditing &&
					<Button className='delete' type='raised' onClick={this.deleteStudent}>
						Delete
					</Button>}
				</span>
				<Icon className='student-list-item--go' name='ios-arrow-forward' />
			</Link>
		</span>)
	}
}


export default class StudentList extends Component {
	static propTypes = {
		filter: PropTypes.string,
		isEditing: PropTypes.bool,
		sortBy: PropTypes.oneOf(['modified', 'name']),
		students: PropTypes.object.isRequired,
	}

	static defaultProps = {
		isEditing: false,
		filter: '',
	}

	render() {
		// console.log('StudentList#render')
		let sortProp = 'dateLastModified'
		if (this.props.sortBy === 'name') {
			sortProp = 'name'
		}

		const studentObjects = map(
				sortBy(
					filter(
						values(this.props.students),
						s => fuzzysearch(this.props.filter, s.name.toLowerCase())),
					s => s[sortProp]),
				student =>
					<StudentListItem
						key={student.id}
						student={student}
						isEditing={this.props.isEditing}
					/>
			)

		return (
			<List className='student-list' type='plain'>
				{studentObjects}
			</List>
		)
	}
}

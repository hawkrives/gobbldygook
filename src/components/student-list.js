import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'

import fuzzysearch from 'fuzzysearch'
import identity from 'lodash/utility/identity'

import studentActions from '../flux/student-actions'

import AvatarLetter from './avatar-letter'
import Button from './button'
import List from './list'
import Icon from './icon'

import './student-list.scss'

class StudentListItem extends Component {
	static propTypes = {
		isEditing: PropTypes.bool,
		student: PropTypes.instanceOf(Immutable.Record).isRequired,
	}

	static defaultProps = {
		isEditing: false,
	}

	render() {
		// console.log('StudentListItem#render')
		const student = this.props.student
		const groupedStudies = student.studies.groupBy(s => s.type)
		return (<span>
			<Link className='student-list-item' to='student' params={{id: student.id}}>
				<AvatarLetter value={student.name} />
				<span className='student-list-item-info'>
					<div className='name'>{student.name || ''}</div>
					<div className='areas'>
						{['degree', 'major', 'concentration', 'emphasis']
							.map(type => groupedStudies.get(type))
							.filter(identity)
							.map(group =>
								group.toArray()
									.map(s => s.name)
									.join(' · '))
							.map((group, i, coll) =>
								<span className='area-type' key={i}>
									{group}{i < coll.length - 1 ? <span className='joiner'>※</span> : null}
								</span>)}
					</div>
				</span>
				<span className='student-list-item-actions'>
					{
						this.props.isEditing
							? <Button className='delete' type='raised'
								onClick={ev => {
									ev.preventDefault()
									studentActions.destroyStudent(student.id)
								}}>Delete</Button>
							: null
					}
				</span>
				<Icon className='student-list-item--go' name='ionicon-ios-arrow-forward' />
			</Link>
		</span>)
	}
}


export default class StudentList extends Component {
	static propTypes = {
		filter: PropTypes.string,
		isEditing: PropTypes.bool,
		sortBy: PropTypes.oneOf(['modified', 'name']),
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
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

		const studentObjects = this.props.students
			.toList()
			.filter(s => fuzzysearch(this.props.filter, s.name.toLowerCase()))
			.sortBy(s => s[sortProp])
			.map(student =>
				<StudentListItem
					key={student.id}
					student={student}
					isEditing={this.props.isEditing}
				/>)
			.toArray()

		return (
			<List className='student-list' type='plain' canSelect>
				{studentObjects}
			</List>
		)
	}
}

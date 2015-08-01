import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {Link} from 'react-router'
import studentActions from '../flux/studentActions'
import fuzzysearch from 'fuzzysearch'
import any from 'lodash/collection/any'

export default class StudentList extends Component {
	static propTypes = {
		isEditing: PropTypes.bool,
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	static defaultProps = {
		isEditing: false,
	}

	constructor() {
		super()

		// since we are starting off without any data, there is no initial value
		this.state = {
			studentFilter: '',
		}
	}

	render() {
		// console.log('StudentList#render')
		let studentObjects = this.props.students
			.toList()
			.filter(s =>
				fuzzysearch(this.state.studentFilter, s.name.toLowerCase()) ||
				any(s.studies.map(st => st.name.toLowerCase()).toArray(), name => fuzzysearch(this.state.studentFilter, name)))
			.sortBy(s => s.dateLastModified)
			.map(student =>
				<li key={student.id}>
					<Link className='student-list-item' to='student' params={{id: student.id}}>
						{
							this.props.isEditing
								? <span className='delete' onClick={(ev) => {
									ev.preventDefault()
									studentActions.destroyStudent(student.id)
								}}>×</span>
								: null
						}
						<span className='name'>{student.name || ''}</span>
						<span className='areas'>{student.studies.map(st => st.name).toArray().join(', ')}</span>
					</Link>
				</li>)
			.toArray()

		return (
			<ol className='student-list'>
				{studentObjects}
			</ol>
		)
	}
}

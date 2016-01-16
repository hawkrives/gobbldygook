import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'
import interpose from '../../../helpers/interpose'

import Button from '../../../components/button'
import Icon from '../../../components/icon'

import './student-list-item.scss'

export default function StudentListItem(props) {
	const { student, isEditing, destroyStudent } = props
	const groupedStudies = groupBy(student.studies, s => s.type)
	return (
		<li className='student-list-item-container'>
			{isEditing &&
			<Button className='delete' type='flat' onClick={() => destroyStudent(student.id)}>
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

StudentListItem.propTypes = {
	destroyStudent: PropTypes.func.isRequired,
	isEditing: PropTypes.bool.isRequired,
	student: PropTypes.object.isRequired,
}

import React, {PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import fuzzysearch from 'fuzzysearch'

import List from '../../../components/list'
import StudentListItem from './student-list-item'

import './student-list.scss'

export default function StudentList(props) {
	const {
		isEditing,
		destroyStudent,
		students,
	} = props

	let {
		filter: filterText,
		sortBy: sortByKey,
		groupBy: groupByKey,
	} = props

	filterText = filterText.toLowerCase()

	const studentObjects = map(
		sortBy(
			filter(
				students,
				s => fuzzysearch(filterText, s.data.name.toLowerCase())),
			s => s.data[sortByKey]),
		student =>
			<StudentListItem
				key={student.data.id}
				student={student}
				destroyStudent={destroyStudent}
				isEditing={isEditing}
			/>
	)

	return (
		<List className='student-list' type='plain'>
			{studentObjects}
		</List>
	)
}

StudentList.propTypes = {
	destroyStudent: PropTypes.func.isRequired,
	filter: PropTypes.string.isRequired,
	groupBy: PropTypes.string.isRequired,
	isEditing: PropTypes.bool.isRequired,
	sortBy: PropTypes.oneOf(['dateLastModified', 'name', 'canGraduate']).isRequired,
	students: PropTypes.object.isRequired,
}

StudentList.defaultProps = {
	filter: '',
	students: {},
}

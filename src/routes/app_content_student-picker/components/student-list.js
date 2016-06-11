const React = require('react')
const {PropTypes} = React
import {filter, map, sortBy} from 'lodash-es'
const fuzzysearch = require('fuzzysearch')

import List from '../../../components/list'
import StudentListItem from './student-list-item'

// import './student-list.css'

export default function StudentList(props) {
	const {
		isEditing,
		destroyStudent,
		students,
	} = props

	let {
		filter: filterText,
		sortBy: sortByKey,
		// groupBy: groupByKey,
	} = props

	filterText = filterText.toLowerCase()

	const studentObjects = map(
		sortBy(
			filter(students, s =>
				fuzzysearch(filterText, (s.data.present.name || '').toLowerCase())),
			s => s.data.present[sortByKey]),
		(student, i) =>
			<StudentListItem
				key={student.data.present.id || i}
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

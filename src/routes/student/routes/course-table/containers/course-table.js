import React, {PropTypes} from 'react'
import { connect } from 'react-redux'

import findFirstAvailableYear from '../../../../../helpers/find-first-available-year'
import findFirstAvailableSemester from '../../../../../helpers/find-first-available-semester'

import map from 'lodash/collection/map'
import filter from 'lodash/filter'

import CourseTable from '../components/course-table'

import {addSchedule, destroySchedules} from '../../../../../redux/students/actions'
import {bindActionCreators} from 'redux'

const addYear = (addSchedule, student) => {
	addSchedule(student.id, {
		year: findFirstAvailableYear(student.schedules, student.matriculation),
		semester: 1,
		index: 1,
		active: true,
	})
}

const addSemester = (addSchedule, student, year) => {
	const nextAvailableSemester = findFirstAvailableSemester(student.schedules, year)

	addSchedule(student.id, {
		year: year, semester: nextAvailableSemester,
		index: 1, active: true,
	})
}

const removeYear = (destroySchedules, student, year) => {
	const thisYearSchedules = filter(student.schedules, s => s.year === parseInt(year))
	const scheduleIds = map(thisYearSchedules, s => s.id)

	destroySchedules(student.id, ...scheduleIds)
}


export function CourseTableContainer(props) {
	return (
		<CourseTable
			student={props.student}
			addYear={() => addYear(props.addSchedule, props.student)}
			addSemester={year => addSemester(props.addSchedule, props.student, year)}
			removeYear={year => removeYear(props.destroySchedules, props.student, year)}
		/>
	)
}

CourseTableContainer.propTypes = {
	addSchedule: PropTypes.func.isRequired,
	className: PropTypes.string,
	destroySchedules: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
}


const mapDispatchToProps = dispatch =>
	bindActionCreators({addSchedule, destroySchedules}, dispatch)

export default connect(undefined, mapDispatchToProps)(CourseTable)

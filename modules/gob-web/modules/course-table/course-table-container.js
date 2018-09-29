// @flow

import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import map from 'lodash/map'
import filter from 'lodash/filter'

import {
	addSchedule,
	destroySchedules,
} from '../../redux/students/actions/schedules'
import {findFirstAvailableYear} from '../../helpers/find-first-available-year'
import {findFirstAvailableSemester} from '../../helpers/find-first-available-semester'
import type {HydratedStudentType} from '@gob/object-student'
import values from 'lodash/values'

import CourseTable from './course-table'

const addYear = (addSchedule, student) => {
	addSchedule(student.id, {
		year: findFirstAvailableYear(
			values(student.schedules),
			student.matriculation,
		),
		semester: 1,
		index: 1,
		active: true,
	})
}

const addSemester = (addSchedule, student, year) => {
	const nextAvailableSemester = findFirstAvailableSemester(
		values(student.schedules),
		year,
	)

	addSchedule(student.id, {
		year: year,
		semester: nextAvailableSemester,
		index: 1,
		active: true,
	})
}

const removeYear = (destroySchedules, student, year) => {
	const thisYearSchedules = filter(
		student.schedules,
		s => s.year === parseInt(year),
	)
	const scheduleIds = map(thisYearSchedules, s => s.id)

	destroySchedules(student.id, ...scheduleIds)
}

type Props = {
	addSchedule: Function,
	className?: string,
	destroySchedules: Function,
	student: HydratedStudentType,
}

export function CourseTableContainer(props: Props) {
	const student = props.student

	return (
		<CourseTable
			className={props.className}
			student={student}
			addYear={() => addYear(props.addSchedule, student)}
			addSemester={year => addSemester(props.addSchedule, student, year)}
			removeYear={year =>
				removeYear(props.destroySchedules, student, year)
			}
		/>
	)
}

const mapDispatchToProps = dispatch =>
	bindActionCreators({addSchedule, destroySchedules}, dispatch)

export default connect(
	undefined,
	mapDispatchToProps,
)(CourseTableContainer)

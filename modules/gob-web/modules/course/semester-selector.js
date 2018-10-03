// @flow

import React from 'react'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {semesterName, expandYear} from '@gob/school-st-olaf-college'
import {Student} from '@gob/object-student'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'

function semesterList(student: Student): Map<number, Map<string, string>> {
	return student.schedules
		.toList()
		.map(s => ({
			term: s.getTerm(),
			id: s.id,
			title: `${semesterName(s.semester)} – ${s.title}`,
		}))
		.groupBy(s => s.term)
		.sortBy((_, term) => term)
		.map(group => Map(group.map(s => [s.id, s.title])))
		.toMap()
}

type Props = {
	clbid: string,
	scheduleId?: string,
	student: Student,
	changeStudent: ChangeStudentFunc,
}

const NO_SCHEDULE: '$none' = '$none'
const REMOVE_FROM_SCHEDULE: '$remove' = '$remove'

class SemesterSelector extends React.Component<Props> {
	moveToSchedule = ev => {
		let {scheduleId, student, clbid} = this.props

		if (!scheduleId) {
			return
		}

		let targetScheduleId = ev.currentTarget.value
		if (targetScheduleId === NO_SCHEDULE) {
			return
		}

		let s = null
		if (targetScheduleId === REMOVE_FROM_SCHEDULE) {
			s = student.removeCourseFromSchedule(scheduleId, clbid)
		} else if (scheduleId) {
			s = student.moveCourseToSchedule({
				from: scheduleId,
				to: targetScheduleId,
				clbid,
			})
		} else {
			s = student.addCourseToSchedule(targetScheduleId, clbid)
		}

		this.props.changeStudent(s)
	}

	render() {
		let {scheduleId, student} = this.props

		let specialOption = scheduleId ? (
			<option value={REMOVE_FROM_SCHEDULE}>Remove from Schedule</option>
		) : (
			<option value={NO_SCHEDULE}>No Schedule</option>
		)

		let options = semesterList(student).map((group, year) => (
			<optgroup key={year} label={expandYear(year, true, '–')}>
				{group.map((title: string, id: string) => (
					<option value={id} key={id}>
						{title}
					</option>
				))}
			</optgroup>
		))

		return (
			<select
				value={scheduleId || NO_SCHEDULE}
				onChange={this.moveToSchedule}
			>
				{specialOption}
				{[...options]}
			</select>
		)
	}
}

const connected = connect(
	undefined,
	{changeStudent},
)(SemesterSelector)

export {connected as SemesterSelector}

// @flow
import React from 'react'

import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import {semesterName, expandYear} from '@gob/school-st-olaf-college'

function findSemesterList(student: ?Object) {
	if (!student) {
		return {}
	}

	let schedules = map(student.schedules, s => ({
		...s,
		title: `${semesterName(s.semester)} – ${s.title}`,
	}))

	return groupBy(
		sortBy(schedules, [s => s.year, s => s.semester]),
		s => s.year,
	)
}

const moveToSchedule = ({
	moveCourse,
	addCourse,
	removeCourse,
	scheduleId,
	studentId,
	clbid,
}: {
	moveCourse: Function,
	addCourse: Function,
	removeCourse: Function,
	scheduleId: ?string,
	studentId: ?string,
	clbid: ?string,
}) => {
	if (!studentId || !scheduleId || clbid === null || clbid === undefined) {
		return () => {}
	}
	return ev => {
		const targetScheduleId = ev.target.value
		if (targetScheduleId === '$none') {
			return
		} else if (targetScheduleId === '$remove') {
			return removeCourse(studentId, scheduleId, clbid)
		}

		if (scheduleId) {
			return moveCourse(studentId, scheduleId, targetScheduleId, clbid)
		} else {
			return addCourse(studentId, targetScheduleId, clbid)
		}
	}
}

export default function SemesterSelector({
	scheduleId,
	student,
	moveCourse,
	addCourse,
	removeCourse,
	clbid,
}: {
	addCourse: (string, string, string) => any,
	clbid?: string,
	moveCourse: (string, string, string, string) => any,
	removeCourse: (string, string, string) => any,
	scheduleId?: string,
	student?: Object,
}) {
	const studentId = student ? student.id : null
	const specialOption = scheduleId ? (
		<option value="$remove">Remove from Schedule</option>
	) : (
		<option value="$none">No Schedule</option>
	)

	const options = map(findSemesterList(student), (group, year) => (
		<optgroup key={year} label={expandYear(year, true, '–')}>
			{map(group, schedule => (
				<option value={schedule.id} key={schedule.id}>
					{schedule.title}
				</option>
			))}
		</optgroup>
	))

	return (
		<select
			value={scheduleId || 'none'}
			disabled={!student || !clbid}
			onChange={moveToSchedule({
				moveCourse,
				addCourse,
				removeCourse,
				scheduleId,
				studentId,
				clbid,
			})}
		>
			{specialOption}
			{options}
		</select>
	)
}

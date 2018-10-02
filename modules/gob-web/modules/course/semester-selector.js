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

const moveToSchedule = (args: {
	scheduleId: ?string,
	student: ?Object,
	clbid: ?string,
}) => {
	let {scheduleId, student, clbid} = args

	if (!student || !scheduleId || clbid === null || clbid === undefined) {
		return () => {}
	}

	return ev => {
		const targetScheduleId = ev.currentTarget.value
		if (targetScheduleId === '$none') {
			return
		} else if (targetScheduleId === '$remove') {
			return student.removeCourse({from: scheduleId, clbid})
		}

		if (scheduleId) {
			return student.moveCourse({from: scheduleId, to: targetScheduleId, clbid})
		} else {
			return student.addCourse({to: targetScheduleId, clbid})
		}
	}
}

export default function SemesterSelector(props: {
	clbid?: string,
	scheduleId?: string,
	student?: Object,
}) {
	let {scheduleId, student, clbid} = props

	const specialOption = scheduleId ? (
		<option value="$remove">Remove from Schedule</option>
	) : (
		<option value="$none">No Schedule</option>
	)

	const options = map(findSemesterList(student), (group, year) => (
		<optgroup key={year} label={expandYear(year, true, '–')}>
			{group.map(schedule => (
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
			onChange={moveToSchedule({scheduleId, student, clbid})}
		>
			{specialOption}
			{options}
		</select>
	)
}

// @flow

import React from 'react'
import {semesterName} from '@gob/school-st-olaf-college'
import {Card} from '../../components/card'
import {Info, Interval, DateTime, Duration} from 'luxon'
import {List, Range} from 'immutable'
import type {Course as CourseType, CourseError} from '@gob/types'
import {
	Student,
	Schedule,
	type WarningType,
	type FabricationType,
} from '@gob/object-student'

type Props = {
	checking?: boolean,
	courses: List<CourseType | FabricationType | CourseError>,
	credits?: number,
	hasConflict?: boolean,
	loading?: boolean,
	schedule: Schedule,
	student: Student,
	warnings?: Map<string, List<WarningType>>,
}

export class WeekCalendar extends React.Component<Props> {
	render() {
		let {schedule, credits, courses, hasConflict} = this.props

		// let duration = Interval.after(
		// 	DateTime.local(),
		// 	Duration.fromObject({weeks: 1}),
		// )

		let now = DateTime.local()

		let startOfWeek = now.startOf('week')
		let endOfWeek = now.endOf('week')

		console.log(
			startOfWeek.toLocaleString(DateTime.DATE_FULL),
			endOfWeek.toLocaleString(DateTime.DATE_FULL),
		)

		let dates = List()
		let dayCount = Math.ceil(endOfWeek.diff(startOfWeek).as('days'))

		for (let i of Range(0, dayCount)) {
			dates = dates.push(startOfWeek.plus({days: i}))
		}

		let startHour = 7
		let hoursCount = 12

		let hours = List()
		let startOfDay = startOfWeek.set({hours: startHour})

		for (let i of Range(0, hoursCount, 1)) {
			for (let j of Range(0, 60, 10)) {
				hours = hours.push(startOfDay.plus({hours: i, minutes: j}))
			}
		}

		return (
			<>
				Schedule <code>{schedule.id}</code> has {courses.size} courses,
				providing {credits} credits.
				<br />
				{hasConflict ? 'It has problems' : 'It looks fine.'}
				<table>
					<thead>
						<tr>
							<th />
							{dates.map((date, i) => (
								<th key={i}>{date.weekdayLong}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{hours.map((time, i) => (
							<tr key={i}>
								<th>
									{time.toLocaleString({
										hour: '2-digit',
										minute: '2-digit',
									})}
								</th>
							</tr>
						))}
					</tbody>
				</table>
			</>
		)
	}
}

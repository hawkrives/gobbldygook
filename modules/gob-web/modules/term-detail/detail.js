// @flow

import React from 'react'
import DocumentTitle from 'react-document-title'
import {semesterName} from '@gob/school-st-olaf-college'
import {Student} from '@gob/object-student'
import {Card} from '../../components/card'
import {ScheduleProvider} from '../../components/providers/schedule'
import {WeekCalendar} from './week-calendar'

type RouterProps = {
	term?: string,
	uri?: string, // TODO: not actually optional
}

type ReactProps = {
	className?: string,
	student: Student,
}

type Props = RouterProps & ReactProps

export class TermDetail extends React.Component<Props> {
	render() {
		let {term, student} = this.props

		if (!term) {
			return (
				<Card>
					<p>Unknown term</p>
				</Card>
			)
		}

		let year = parseInt(term.substr(0, 4), 10)
		let semester = parseInt(term.substr(4, 1), 10)

		let schedules = student.findSchedulesForTerm({year, semester})

		if (!schedules.size) {
			return (
				<Card>
					<p>
						Could not find any schedules for term{' '}
						<code>{term}</code>.
					</p>
				</Card>
			)
		}

		let sem = semesterName(semester)
		let name = this.props.student.name

		return (
			<>
				<DocumentTitle
					title={`${sem} ${year} • ${name} | Gobbldygook`}
				/>
				{schedules.map(s => (
					<Card key={s.id}>
						<ScheduleProvider schedule={s} student={student}>
							{({courses, hasConflict, credits, warnings}) => (
								<WeekCalendar
									//warnings={warnings}
									hasConflict={hasConflict}
									student={student}
									schedule={s}
									courses={courses}
									credits={credits}
								/>
							)}
						</ScheduleProvider>
					</Card>
				))}
			</>
		)
	}
}

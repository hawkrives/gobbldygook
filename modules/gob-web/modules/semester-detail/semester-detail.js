// @flow
import React from 'react'
import filter from 'lodash/filter'
import DocumentTitle from 'react-document-title'
import {isCurrentSemester} from '@gob/object-student'
import {semesterName} from '@gob/school-st-olaf-college'
import styled from 'styled-components'
import type {HydratedScheduleType, StudentType} from '@gob/object-student'

const DetailText = styled.pre`
	background-color: white;
	margin: 0;
`

type RouterProps = {
	term?: string,
	uri: string,
}

type ReactProps = {
	className?: string,
	student: StudentType,
}

type Props = RouterProps & ReactProps

type State = {
	term: ?string,
	schedules: Array<HydratedScheduleType>,
}

export default class SemesterDetail extends React.Component<Props, State> {
	state = {
		term: null,
		schedules: [],
	}

	render() {
		const {term} = this.props

		if (!term) {
			return <p>Unknown term</p>
		}

		let year = parseInt(term.substr(0, 4), 10)
		let semester = parseInt(term.substr(4, 1), 10)
		const student = this.props.student

		const schedules = filter(
			student.schedules,
			isCurrentSemester(year, semester),
		).map(
			({courses: _1, conflicts: _2, hasConflict: _3, ...sched}) => sched,
		)

		const sem = semesterName(semester)
		const title = `${sem} ${year} • ${student.name} | Gobbldygook`

		return (
			<>
				<DocumentTitle title={title} />
				<DetailText>
					{this.props.uri}
					{'\n'}
					{JSON.stringify(schedules, null, 2)}
				</DetailText>
			</>
		)
	}
}

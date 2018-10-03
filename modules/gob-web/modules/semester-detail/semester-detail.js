// @flow
import React from 'react'
import filter from 'lodash/filter'
import DocumentTitle from 'react-document-title'
import {semesterName} from '@gob/school-st-olaf-college'
import styled from 'styled-components'
import {Schedule, Student} from '@gob/object-student'

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
	student: Student,
}

type Props = RouterProps & ReactProps

type State = {
	term: ?string,
}

export default class SemesterDetail extends React.Component<Props, State> {
	state = {
		term: null,
	}

	render() {
		const {term} = this.props

		if (!term) {
			return <p>Unknown term</p>
		}

		let year = parseInt(term.substr(0, 4), 10)
		let semester = parseInt(term.substr(4, 1), 10)

		const schedules = this.props.student.findAllSchedulesForTerm({
			year,
			semester,
		})

		let sem = semesterName(semester)
		let name = this.props.student.name
		let title = `${sem} ${year} • ${name} | Gobbldygook`

		return (
			<>
				<DocumentTitle title={title} />
				<DetailText>
					{this.props.uri}
					{'\n'}
					{JSON.stringify(schedules.toJSON(), null, 2)}
				</DetailText>
			</>
		)
	}
}

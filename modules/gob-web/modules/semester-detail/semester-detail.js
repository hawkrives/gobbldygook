// @flow
import React from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import DocumentTitle from 'react-document-title'
import {isCurrentSemester} from '@gob/object-student'
import {semesterName} from '@gob/school-st-olaf-college'
import debug from 'debug'
import styled from 'styled-components'
const log = debug('web:react')

const DetailText = styled('pre')`
	background-color: white;
	margin: 0;
`

type RouterProps = {
	location: {
		pathname: string,
		search: string,
	},
	params: {
		year: number,
		semester: number,
	},
}

type ReactProps = {
	className?: string,
	student: {
		data: {
			past: Object,
			present: Object,
			future: Object,
		},
	},
}

type Props = RouterProps & ReactProps

type State = {
	year: ?number,
	semester: ?number,
	schedules: Array<Object>,
}

export default class SemesterDetail extends React.Component<Props, State> {
	state = {
		year: null,
		semester: null,
		schedules: [],
	}

	render() {
		log('SemesterDetail#render')
		const {year, semester} = this.props.params
		const student = this.props.student.data.present

		const schedules = map(
			filter(student.schedules, isCurrentSemester(year, semester)),
			sched => omit(sched, 'courses'),
		)

		const sem = semesterName(semester)
		const title = `${sem} ${year} • ${student.name} | Gobbldygook`

		return (
			<DocumentTitle title={title}>
				<DetailText>
					{this.props.location.pathname}
					{'\n'}
					{JSON.stringify(schedules, null, 2)}
				</DetailText>
			</DocumentTitle>
		)
	}
}

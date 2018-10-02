// @flow

import React from 'react'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'

import {FlatButton} from '../../components/button'
import Semester from './semester-container'

import {findFirstAvailableSemester} from '../../helpers/find-first-available-semester'
import {expandYear, semesterName} from '@gob/school-st-olaf-college'
import type {HydratedStudentType, ScheduleType} from '@gob/object-student'
import * as theme from '../../theme'
import styled from 'styled-components'

const Container = styled.div`
	margin-bottom: var(--page-edge-padding);
`

const Header = styled.header`
	${theme.noSelect};
	margin: 0;

	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;

	font-variant-numeric: tabular-nums;

	line-height: 1em;
	font-weight: 500;
	font-size: 0.9em;
`

const TitleText = styled.h1`
	${theme.headingNeutral};
	white-space: nowrap;
	flex: 1;

	margin-left: calc(var(--semester-spacing) + var(--semester-side-padding));
`

const TitleButton = styled(FlatButton)`
	transition: 0.15s;

	min-height: 0;
	padding: 0 0.5em;

	text-transform: none;
	font-weight: 400;

	color: var(--gray-500);

	& + & {
		margin-left: 0.1em;
	}
`

const RemoveYearButton = styled(TitleButton)`
	&:hover {
		color: var(--red-500);
		background-color: var(--red-50);
		border: solid 1px var(--red-500);
	}
`

const SemesterList = styled.div`
	flex: 1;

	display: flex;
	flex-flow: row wrap;
`

const canAddSemester = (nextAvailableSemester?: number) => {
	return nextAvailableSemester != null && nextAvailableSemester <= 5
}

type Props = {
	student: HydratedStudentType,
	year: number,
}

export default class Year extends React.PureComponent<Props> {
	addSemester = () => {
		const nextAvailableSemester = findFirstAvailableSemester(
			values(this.props.student.schedules),
			this.props.year,
		)

		this.props.student.addSchedule({
			year: this.props.year,
			semester: nextAvailableSemester,
			index: 1,
			active: true,
		})
	}

	removeYear = () => {
		this.props.student.removeSchedulesForYear(this.props.year)
	}

	render() {
		let {student, year} = this.props
		let {schedules} = student

		let valid = filter(
			schedules,
			s => s.active === true && s.year === year,
		).map(s => s.semester)
		let sorted = sortBy(valid, s => s)

		let niceYear = expandYear(year)

		let nextSemester = findFirstAvailableSemester(
			((valid: Array<any>): Array<ScheduleType>),
			year,
		)
		let isAddSemesterDisabled = !canAddSemester(nextSemester)

		return (
			<Container>
				<Header>
					<TitleText>{niceYear}</TitleText>
					<>
						{!isAddSemesterDisabled &&
							nextSemester != null && (
								<TitleButton
									type="flat"
									title="Add Semester"
									onClick={this.addSemester}
								>
									Add ‘{semesterName(nextSemester)}’
								</TitleButton>
							)}
						<RemoveYearButton
							type="flat"
							title={`Remove the year ${niceYear}`}
							onClick={this.removeYear}
						>
							Remove Year
						</RemoveYearButton>
					</>
				</Header>

				<SemesterList>
					{sorted.map(semester => (
						<Semester
							key={semester}
							semester={semester}
							student={student}
							year={year}
						/>
					))}
				</SemesterList>
			</Container>
		)
	}
}

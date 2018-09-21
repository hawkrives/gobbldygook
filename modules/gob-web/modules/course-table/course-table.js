import React from 'react'
import styled from 'styled-components'
import {expandYear} from '@gob/school-st-olaf-college'
import * as theme from '../../theme'
import {findFirstAvailableYear} from '../../helpers/find-first-available-year'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'

import Button from '../../components/button'
import Year from './year'

const AddYearButton = styled(Button)`
	font-feature-settings: 'smcp';

	display: block;
	text-transform: none;

	text-align: left;

	font-weight: 500;
	font-size: 0.9em;

	// 4px is the semester edge padding
	// 7.5px is the internal semester padding
	margin: 0 4px ${theme.pageEdgePadding};
	padding-left: 7.5px;

	&[disabled] {
		text-decoration: line-through;
	}
`

const Container = styled.div``

type PropTypes = {
	addSemester: () => any,
	addYear: () => any,
	className?: string,
	removeYear: () => any,
	student: Object,
}

export default function CourseTable(props: PropTypes) {
	const {student} = props
	const {schedules, matriculation} = student

	const nextAvailableYear = findFirstAvailableYear(schedules, matriculation)
	const canAddYear = true // graduation > nextAvailableYear

	const nextYearButton = canAddYear && (
		<AddYearButton
			key="add-year"
			type="flat"
			title="Add Year"
			onClick={props.addYear}
		>
			Add {expandYear(nextAvailableYear, false, '–')}
		</AddYearButton>
	)

	let sorted = sortBy(schedules, 'year')
	let grouped = groupBy(sorted, 'year')

	let years = map(grouped, (schedules, year) => (
		<Year
			key={year}
			year={Number(year)}
			student={student}
			addSemester={props.addSemester}
			removeYear={props.removeYear}
		/>
	))
	years.splice(nextAvailableYear - matriculation + 1, 0, nextYearButton)

	return <Container className={props.className}>{years}</Container>
}

// @flow

import React from 'react'
import styled from 'styled-components'
import {expandYear} from '@gob/school-st-olaf-college'
import {findFirstAvailableYear} from '../../helpers/find-first-available-year'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'

import {FlatButton} from '../../components/button'
import Year from './year'

const AddYearButton = styled(FlatButton)`
	display: block;

	text-align: left;

	font-weight: 500;
	font-size: 0.9em;

	// 4px is the semester edge padding
	// 7.5px is the internal semester padding
	margin: 0 var(--semester-spacing) var(--block-edge-padding);
	padding-left: var(--semester-side-padding);

	&[disabled] {
		text-decoration: line-through;
	}
`

const Container = styled.div``

type PropTypes = {
	addSemester: number => mixed,
	addYear: number => mixed,
	className?: string,
	removeYear: number => mixed,
	student: Object,
}

export default function CourseTable(props: PropTypes) {
	let {student} = props
	let {schedules, matriculation} = student

	let nextAvailableYear = findFirstAvailableYear(schedules, matriculation)
	let canAddYear = nextAvailableYear != null // graduation > nextAvailableYear

	let nextYearButton = canAddYear &&
		nextAvailableYear != null && (
			<AddYearButton
				key="add-year"
				title="Add Year"
				onClick={props.addYear}
			>
				Add {expandYear(nextAvailableYear, false, '–')}
			</AddYearButton>
		)

	let sorted = sortBy(schedules, s => s.year)
	let grouped = groupBy(sorted, s => s.year)

	let years = map(grouped, (schedules, year) => (
		<Year
			key={year}
			year={Number(year)}
			student={student}
			addSemester={props.addSemester}
			removeYear={props.removeYear}
		/>
	))

	if (nextAvailableYear != null) {
		years.splice(nextAvailableYear - matriculation + 1, 0, nextYearButton)
	}

	return <Container className={props.className}>{years}</Container>
}

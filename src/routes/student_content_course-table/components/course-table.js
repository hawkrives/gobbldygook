const React = require('react')
const {PropTypes} = React
const cx = require('classnames')
import expandYear from '../../../helpers/expand-year'

import findFirstAvailableYear from '../../../helpers/find-first-available-year'
import {map, sortBy, groupBy} from 'lodash-es'

import Button from '../../../components/button'
import Year from './year'

// import './course-table.css'

export default function CourseTable(props) {
	const { student } = props
	const { schedules, matriculation, graduation } = student

	const nextAvailableYear = findFirstAvailableYear(schedules, matriculation)
	const canAddYear = (graduation > nextAvailableYear)

	const nextYearButton = canAddYear && (
		<Button
			className='add-year'
			key='add-year'
			type='flat'
			title='Add Year'
			onClick={props.addYear}
		>
			{`Add ${expandYear(nextAvailableYear, false, '–')}`}
		</Button>
	)

	let sorted = sortBy(schedules, 'year')
	let grouped = groupBy(sorted, 'year')

	let years = map(grouped, (schedules, year) =>
		<Year
			key={year}
			year={Number(year)}
			student={student}
			addSemester={() => props.addSemester(Number(year))}
			removeYear={() => props.removeYear(Number(year))}
		/>)
	years.splice(nextAvailableYear - matriculation, 0, nextYearButton)

	return (
		<div className={cx('course-table', props.className)}>
			{years}
		</div>
	)
}

CourseTable.propTypes = {
	addSemester: PropTypes.func.isRequired,
	addYear: PropTypes.func.isRequired,
	className: PropTypes.string,
	removeYear: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
}

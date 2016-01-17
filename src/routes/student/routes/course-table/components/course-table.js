import cx from 'classnames'
import expandYear from '../../../../../helpers/expand-year'

import findFirstAvailableYear from '../../../../../helpers/find-first-available-year'
import sortBy from 'lodash/collection/sortBy'
import groupBy from 'lodash/collection/groupBy'

import Button from '../../../../../components/button'
import Year from './year'

import './course-table.scss'

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
			addSemester={() => this.props.addSemester(year)}
			removeYear={() => this.props.removeYear(year)}
		/>)
	years.splice(nextAvailableYear - matriculation, 0, nextYearButton)

	return (
		<div className={cx('course-table', props.className)}>
			{years}
		</div>
	)
}

CourseTable.propTypes = {
	addYear: PropTypes.func.isRequired,
	addSemester: PropTypes.func.isRequired,
	className: PropTypes.string,
	removeYear: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
}

import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import expandYear from '../helpers/expand-year'
import findFirstAvailableYear from '../helpers/find-first-available-year'
import sortBy from 'lodash/collection/sortBy'
import groupBy from 'lodash/collection/groupBy'
import map from 'lodash/collection/map'

import Button from '../components/button'
import Year from '../components/year'

import './course-table.scss'

export default class CourseTable extends Component {
	static propTypes = {
		actions: PropTypes.object,
		className: PropTypes.string,
		courses: PropTypes.arrayOf(PropTypes.object),
		student: PropTypes.object,
	};

	static defaultProps = {
		student: {},
	};

	addYear = () => {
		this.props.actions.addSchedule(this.props.student.id, {
			year: findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation),
			semester: 1,
			index: 1,
			active: true,
		})
	}

	render() {
		// console.log('CourseTable.render()')
		if (!this.props.student) {
			return null
		}

		const nextAvailableYear = findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation)
		const canAddYear = (this.props.student.graduation > nextAvailableYear)

		const nextYearButton = canAddYear && (
			<Button className='add-year'
				key='add-year'
				type='flat'
				title='Add Year'
				onClick={this.addYear}>
				{`Add ${expandYear(nextAvailableYear, false, '–')}`}
			</Button>
		)

		let sorted = sortBy(this.props.student.schedules, 'year')
		let grouped = groupBy(sorted, 'year')
		let years = map(grouped, (schedules, year) =>
			<Year
				key={year}
				year={Number(year)}
				actions={this.props.actions}
				courses={this.props.courses}
				student={this.props.student}
			/>)
		years.splice(nextAvailableYear - this.props.student.matriculation, 0, nextYearButton)

		return (
			<div className={cx('course-table', this.props.className)}>
				{years}
			</div>
		)
	}
}

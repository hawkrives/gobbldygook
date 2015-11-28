import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import expandYear from '../helpers/expand-year'
import findFirstAvailableYear from '../helpers/find-first-available-year'

import studentActions from '../flux/student-actions'

import Button from '../components/button'
import Year from '../components/year'

import './course-table.scss'

export default class CourseTable extends Component {
	static propTypes = {
		className: PropTypes.string,
		courses: PropTypes.arrayOf(PropTypes.object),
		coursesLoaded: PropTypes.bool,
		showSearchSidebar: PropTypes.func,
		student: PropTypes.object,
	}

	static defaultProps = {
		coursesLoaded: false,
		showSearchSidebar: () => {},
		student: {},
	}

	addYear = () => {
		studentActions.addSchedule(this.props.student.id, {
			year: findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation),
			semester: 1,
			index: 1,
			active: true,
		})
	}

	render() {
		console.log('CourseTable.render()')
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

		const years = this.props.student.schedules
			.sortBy(schedule => schedule.year)
			.groupBy(schedule => schedule.year)
			.map((schedules, year) =>
				<Year
					key={year}
					year={year}
					student={this.props.student}
					courses={this.props.courses}
					coursesLoaded={this.props.coursesLoaded}
					showSearchSidebar={this.props.showSearchSidebar}
				/>)
			.toList()
			.splice(nextAvailableYear - this.props.student.matriculation, 0, nextYearButton)
			.toArray()

		return (
			<div className={cx('course-table', this.props.className)}>
				{years}
			</div>
		)
	}
}

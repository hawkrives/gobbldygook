import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import expandYear from '../helpers/expand-year'
import findFirstAvailableYear from '../helpers/find-first-available-year'
import Immutable from 'immutable'

import studentActions from '../flux/student-actions'
import Student from '../models/student'

import Button from '../components/button'
import Year from '../components/year'

import './course-table.scss'

export default class CourseTable extends Component {
	static propTypes = {
		className: PropTypes.string,
		courses: PropTypes.instanceOf(Immutable.List),
		coursesLoaded: PropTypes.bool.isRequired,
		showSearchSidebar: PropTypes.func.isRequired,
		student: PropTypes.instanceOf(Student).isRequired,
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
		// console.log('CourseTable#render')
		if (!this.props.student) {
			return null
		}

		const nextAvailableYear = findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation)

		const nextYearButton = (
			<Button className='add-year'
				key='add-year'
				type='flat'
				title='Add Year'
				onClick={this.addYear}>
				{`Add ${expandYear(nextAvailableYear, false, '–')}`}
			</Button>
		)

		const years = this.props.student.schedules
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

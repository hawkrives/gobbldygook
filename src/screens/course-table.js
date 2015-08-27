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

		let years = this.props.student.schedules
			.groupBy(schedule => schedule.year)
			.map((schedules, year) =>
				<Year
					key={year}
					year={year}
					student={this.props.student}
					courses={this.props.courses}
					coursesLoaded={this.props.coursesLoaded}
				/>)
			.toArray()

		const nextAvailableYear = findFirstAvailableYear(this.props.student.schedules, this.props.student.matriculation)

		return (
			<div className={cx('course-table', this.props.className)}>
				{years}
				<Button className='add-year'
					type='raised'
					title='Add Year'
					onClick={this.addYear}>
					Add Year ({expandYear(nextAvailableYear, true, '–')})
				</Button>
			</div>
		)
	}
}

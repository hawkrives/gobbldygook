import React, {Component, PropTypes} from 'react'
import studentActions from '../flux/student-actions'

import Button from './button'
import Semester from './semester'

import isCurrentYear from '../helpers/is-current-year'
import expandYear from '../helpers/expand-year'
import semesterName from '../helpers/semester-name'
import findFirstAvailableSemester from '../helpers/find-first-available-semester'

import './year.scss'

export default class Year extends Component {
	static propTypes = {
		courses: PropTypes.arrayOf(PropTypes.object),
		coursesLoaded: PropTypes.bool.isRequired,
		showSearchSidebar: PropTypes.func.isRequired,
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	}

	canAddSemester = () => {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	}

	addSemester = () => {
		const nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			index: 1, active: true,
		})
	}

	removeYear = () => {
		const scheduleIds = this.props.student.schedules
			.filter(isCurrentYear(this.props.year))
			.map(sched => sched.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	}

	render() {
		console.log('Year.render()')

		const terms = this.props.student.schedules
			.filter(sched => sched.active)
			.filter(sched => sched.year === this.props.year)
			.sortBy(schedule => schedule.semester)
			.map(schedule =>
				<Semester
					key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
					student={this.props.student}
					semester={schedule.semester}
					year={this.props.year}
					courses={this.props.courses.filter(c => schedule.clbids.includes(c.clbid))}
					coursesLoaded={this.props.coursesLoaded}
					showSearchSidebar={this.props.showSearchSidebar}
				/>)
			.toList()

		const niceYear = expandYear(this.props.year)

		const nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)
		const isAddSemesterDisabled = !(this.canAddSemester())

		return (
			<div className='year'>
				<header className='year-title'>
					<h1>{niceYear}</h1>

					<span className='buttons'>
						{!isAddSemesterDisabled &&
						<Button className='add-semester'
							type='flat'
							title='Add Semester'
							disabled={isAddSemesterDisabled}
							onClick={this.addSemester}>
							{`Add ‘${semesterName(nextAvailableSemester)}’`}
						</Button>}
						<Button className='remove-year' type='flat'
							title={`Remove the year ${niceYear}`}
							onClick={this.removeYear}>
							Remove Year
						</Button>
					</span>
				</header>
				<div className='row'>
					<div className='semester-list'>
						{terms.toArray()}
					</div>
				</div>
			</div>
		)
	}
}

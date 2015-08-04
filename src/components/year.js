import React, {Component, PropTypes} from 'react'

import studentActions from '../flux/student-actions'
import Student from '../models/student'

import Button from './button'
import Icon from './icon'
import Semester from './semester'

import {isCurrentYear, expandYear, findFirstAvailableSemester} from 'sto-helpers'

export default class Year extends Component {
	static propTypes = {
		student: PropTypes.instanceOf(Student).isRequired,
		year: PropTypes.number.isRequired,
	}

	canAddSemester = () => {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	}

	addSemester = () => {
		let nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	}

	removeYear = () => {
		let scheduleIds = this.props.student.schedules
			.filter(isCurrentYear(this.props.year))
			.map(sched => sched.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	}

	render() {
		// console.log('Year#render')
		const terms = this.props.student.schedules
			.filter(sched => sched.active)
			.filter(sched => sched.year === this.props.year)
			.sortBy(schedule => schedule.semester)
			.map(schedule =>
				<Semester
					key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
					student={this.props.student}
					semester={schedule.semester}
					year={this.props.year} />)
			.toList()

		const niceYear = expandYear(this.props.year)

		const isAddSemesterDisabled = !(this.canAddSemester())

		return (
			<div className='year'>
				<header className='year-title'>
					<h1>{niceYear}</h1>
					<Button className='remove-year' type='flat'
						title={`Remove the year ${niceYear}`}
						onClick={this.removeYear}>
						<Icon name='ionicon-close' />
					</Button>
				</header>
				<div className='semester-list'>
					{terms.toJS()}
				</div>
				<Button className='add-semester'
					type='raised'
					title='Add Semester'
					disabled={isAddSemesterDisabled}
					onClick={this.addSemester}>
					{isAddSemesterDisabled
						? <Icon name='ionicon-android-checkmark-circle' />
						: <Icon name='ionicon-android-add' />}
				</Button>
			</div>
		)
	}
}

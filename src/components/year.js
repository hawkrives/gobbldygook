import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import sortBy from 'lodash/collection/sortBy'
import map from 'lodash/collection/map'
import includes from 'lodash/collection/includes'

import Button from './button'
import Semester from './semester'

import expandYear from '../helpers/expand-year'
import semesterName from '../helpers/semester-name'
import findFirstAvailableSemester from '../helpers/find-first-available-semester'

import './year.scss'

export default class Year extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		courses: PropTypes.arrayOf(PropTypes.object),
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	};

	canAddSemester = () => {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	}

	addSemester = () => {
		const nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		this.props.actions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			index: 1, active: true,
		})
	}

	removeYear = () => {
		const thisYearSchedules = filter(this.props.student.schedules, s => s.year === parseInt(this.props.year))
		const scheduleIds = pluck(thisYearSchedules, 'id')

		this.props.actions.destroySchedules(this.props.student.id, ...scheduleIds)
	}

	render() {
		// console.log('Year.render()')

		let valid = filter(this.props.student.schedules, {active: true, year: this.props.year})
		let sorted = sortBy(valid, 'semester')
		let terms = map(sorted, schedule =>
			<Semester
				key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
				actions={this.props.actions}
				student={this.props.student}
				semester={schedule.semester}
				year={this.props.year}
				courses={filter(this.props.courses, c => includes(schedule.clbids, c.clbid))}
			/>)

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
						{terms}
					</div>
				</div>
			</div>
		)
	}
}

import React, {PropTypes} from 'react'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import map from 'lodash/map'

import Button from 'modules/web/components/button'
import Semester from '../containers/semester'

import {findFirstAvailableSemester} from 'modules/web/helpers/find-first-available-semester'
import {expandYear, semesterName} from 'modules/schools/stolaf'

import './year.scss'


const canAddSemester = (schedules, year) =>
	(findFirstAvailableSemester(schedules, year) <= 5)


export default function Year(props) {
	const { student, year } = props
	const { schedules } = student

	let valid = filter(schedules, {active: true, year: year})
	let sorted = sortBy(valid, 'semester')
	let terms = map(sorted, schedule =>
		<Semester
			key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
			student={student}
			semester={schedule.semester}
			year={year}
		/>)

	const niceYear = expandYear(year)

	const nextAvailableSemester = findFirstAvailableSemester(schedules, year)
	const isAddSemesterDisabled = !(canAddSemester(schedules, year))

	return (
		<div className="year">
			<header className="year-title">
				<h1>{niceYear}</h1>

				<span className="buttons">
					{!isAddSemesterDisabled &&
					<Button
						className="add-semester"
						type="flat"
						title="Add Semester"
						disabled={isAddSemesterDisabled}
						onClick={props.addSemester}
					>
						{`Add ‘${semesterName(nextAvailableSemester)}’`}
					</Button>}
					<Button
						className="remove-year"
						type="flat"
						title={`Remove the year ${niceYear}`}
						onClick={props.removeYear}
					>
						Remove Year
					</Button>
				</span>
			</header>
			<div className="row semester-list">
				{terms}
			</div>
		</div>
	)
}

Year.propTypes = {
	addSemester: PropTypes.func.isRequired,
	removeYear: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
	year: PropTypes.number.isRequired,
}

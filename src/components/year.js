import React from 'react'
import Immutable from 'immutable'

import Semester from './semester'
import studentActions from '../flux/studentActions'

import {isCurrentYear, expandYear, findFirstAvailableSemester} from 'sto-helpers'

let Year = React.createClass({
	propTypes: {
		student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
		year: React.PropTypes.number.isRequired,
	},

	getInitialState() {
		return {
			schedules: Immutable.List(),
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let thisYearSchedules = nextProps.student.schedulesByYear.get(nextProps.year)
		let schedules = thisYearSchedules.filter(s => s.active)
		this.setState({schedules})
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.schedules !== this.state.schedules
	},

	canAddSemester() {
		return findFirstAvailableSemester(this.props.student.schedules, this.props.year) <= 5
	},

	addSemester() {
		let nextAvailableSemester = findFirstAvailableSemester(this.props.student.schedules, this.props.year)

		studentActions.addSchedule(this.props.student.id, {
			year: this.props.year, semester: nextAvailableSemester,
			sequence: 1, active: true,
		})
	},

	removeYear() {
		let currentYearSchedules = this.props.student.schedules.filter(isCurrentYear(this.props.year))
		let scheduleIds = currentYearSchedules.map(s => s.id)

		studentActions.destroyMultipleSchedules(this.props.student.id, scheduleIds)
	},

	render() {
		// console.log('Year#render')
		const terms = this.state.schedules
			.sortBy(schedule => schedule.semester)
			.map((schedule) =>
				<Semester
					key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
					student={this.props.student}
					semester={schedule.semester}
					year={this.props.year} />)
			.toList()

		const niceYear = expandYear(this.props.year)

		return (<div className='year'>
			<header className='year-title'>
				<h1>{niceYear}</h1>
				<button className='remove-year'
					title={`Remove the year ${niceYear}`}
					onClick={this.removeYear} />
			</header>
			<div className='semester-list'>
				{terms.toJS()}
			</div>
			<button className='add-semester'
				title='Add Semester'
				disabled={!this.canAddSemester()}
				onClick={this.addSemester} />
		</div>)
	},
})

export default Year

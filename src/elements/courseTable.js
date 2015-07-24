import React from 'react'

import {expandYear} from 'sto-helpers'
import {findFirstAvailableYear} from 'sto-helpers'

import studentActions from '../flux/studentActions'
import Year from './year'

let CourseTable = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			nextAvailableYear: undefined,
		}
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	componentWillReceiveProps(nextProps) {
		let nextAvailableYear = findFirstAvailableYear(nextProps.student.schedules, nextProps.student.matriculation)
		this.setState({nextAvailableYear})
	},

	addYear() {
		studentActions.addSchedule(this.props.student.id, {
			year: this.state.nextAvailableYear, semester: 1,
			index: 1, active: true,
		})
	},

	render() {
		// console.log('CourseTable#render')
		if (!this.props.student) {
			return null
		}

		let years = this.props.student.schedules
			.sortBy(schedule => schedule.year)
			.groupBy(schedule => schedule.year)
			.map((schedules, year) =>
				<Year student={this.props.student} year={year} key={year} />)
			.toList()
			.toArray()

		return (<div className='course-table'>
			{years}
			<button className='add-year'
				title='Add Year'
				onClick={this.addYear}>
				{expandYear(this.state.nextAvailableYear, false, '–')}
			</button>
		</div>)
	},
})

export default CourseTable

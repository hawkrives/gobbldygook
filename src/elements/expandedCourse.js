import React from 'react'
import map from 'lodash/collection/map'
import {oxford} from 'humanize-plus'
import plur from 'plur'

import CourseTitle from './courseTitle'
import CourseIdentBlock from './courseIdentBlock'
import studentActions from '../flux/studentActions'
import {semesterName} from 'sto-helpers'

function findSemesterList() {
	return [
		{id: 1, title: 'Fall 2012-13'},
		{id: 2, title: 'Interim 2012-13'},
		{id: 3, title: 'Spring 2012-13'},
	]
}

class ExpandedCourse extends React.Component {
	constructor(props) {
		super(props)
		this.removeFromSemester = this.removeFromSemester.bind(this)
	}

	removeFromSemester() {
		studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.info.clbid)
	}

	render() {
		// console.log('ExpandedCourse#render')
		let course = this.props.info
		let tools = []

		// /////

		let title = <CourseTitle {...course} />

		let identifier = <CourseIdentBlock {...course} />

		let professors = (<span className='professors'>
			{oxford(course.instructors)}
		</span>)

		let summary = (<p className='summary'>
			{identifier}{professors}
		</p>)

		// /////

		let offerings = (<p className='offerings'>
			{map(course.times, (time, idx) => <span key={time + idx}>{time}</span>)}
		</p>)

		let gereqs = (<ul className='gereqs'>
			{map(course.gereqs, (ge, idx) => <li key={ge + idx}>{ge}</li>)}
		</ul>)

		let description = <p className='description'>{course.desc}</p>

		let credits = (<span className='credits'>
			{course.credits} {plur('credit', course.credits)}
		</span>)

		let classInstanceOffered = (<span className='instance'>
			{semesterName(course.semester)} {course.year}
		</span>)

		let info = (<p className='info'>
			{credits}
			{classInstanceOffered}
		</p>)

		let details = (<div className='details'>
			{offerings}
			{gereqs}
			{description}
			{info}
		</div>)

		// /////

		let semesterList = (<select className='semester-select' key='semester-select'>
			{map(findSemesterList(), (s =>
				<option value={s.id} key={s.id}>{s.title}</option>))}
		</select>)
		tools.push(semesterList)

		if (this.props.schedule) {
			let deleteButton = <button className='remove-course' onClick={this.removeFromSemester} key='remove-course'>Remove Course</button>
			tools.push(deleteButton)
		}

		let toolsEls = <div className='tools'>{tools}</div>

		// /////

		return (<div>
			<div className='info-wrapper'>
				<div className='info-rows'>
					{title}
					{this.props.children}
					{summary}
				</div>
				<button className='show-info' onClick={this.props.onClick} />
			</div>
			{details}
			{toolsEls}
		</div>)
	}
}

ExpandedCourse.propTypes = {
	children: React.PropTypes.array,
	info: React.PropTypes.object.isRequired,
	onClick: React.PropTypes.func.isRequired,
	schedule: React.PropTypes.object.isRequired,
	student: React.PropTypes.object.isRequired,
}

export default ExpandedCourse

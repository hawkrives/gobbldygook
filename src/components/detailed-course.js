import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import oxford from 'humanize-list'
import plur from 'plur'

import Button from './button'
import BasicCourse from './basic-course'

import studentActions from '../flux/student-actions'
import {semesterName} from 'sto-helpers'

function findSemesterList() {
	return [
		{id: 1, title: 'Fall 2012-13'},
		{id: 2, title: 'Interim 2012-13'},
		{id: 3, title: 'Spring 2012-13'},
	]
}

export default class DetailedCourse extends Component {
	static propTypes = {
		children: PropTypes.array,
		info: PropTypes.object.isRequired,
		onClick: PropTypes.func.isRequired,
		schedule: PropTypes.object.isRequired,
		student: PropTypes.object.isRequired,
	}

	removeFromSemester = () => {
		studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.info.clbid)
	}

	render() {
		const course = this.props.info

		return (
			<div>
				<BasicCourse className='info-wrapper' info={course} onClick={this.props.onClick} />
				<div className='details'>
					<span className='professors'>
						{oxford(course.instructors)}
					</span>
					<p className='description'>
						{course.desc}
					</p>
					<p className='info'>
						<span className='credits'>
							{course.credits} {plur('credit', course.credits)}
						</span>
						<span className='instance'>
							{semesterName(course.semester)} {course.year}
						</span>
					</p>
				</div>
				<div className='tools'>
					<select className='semester-select'>
						{map(findSemesterList(), (s =>
							<option value={s.id} key={s.id}>{s.title}</option>))}
					</select>
					<Button className='remove-course'
						onClick={this.removeFromSemester}
						disabled={!Boolean(this.props.schedule)}>
						Remove Course
					</Button>
				</div>
			</div>
		)
	}
}

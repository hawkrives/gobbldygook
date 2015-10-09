import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import {oxford} from 'humanize-plus'
import plur from 'plur'

import Button from './button'
import BasicCourse from './basic-course'

import Student from '../models/student'
import Schedule from '../models/schedule'

import studentActions from '../flux/student-actions'
import semesterName from '../helpers/semester-name'
import expandYear from '../helpers/expand-year'

function findSemesterList(student) {
	return student.schedules
		.toList()
		.map(sched => ({
			...sched.toObject(),
			title: `${semesterName(sched.get('semester'))} – ${sched.get('title')}`,
		}))
		.sortBy(sched => `${sched.year} ${sched.semester}`)
		.groupBy(sched => sched.year)
		.toJS()
}

export default class DetailedCourse extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		course: PropTypes.object.isRequired,
		onClick: PropTypes.func.isRequired,
		schedule: PropTypes.instanceOf(Schedule),
		student: PropTypes.instanceOf(Student).isRequired,
	}

	removeFromSemester = () => {
		studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.course.clbid)
	}

	moveToSchedule = ev => {
		const targetScheduleId = parseInt(ev.target.value)
		if (this.props.schedule) {
			studentActions.moveCourse(this.props.student.id, this.props.schedule.id, targetScheduleId, this.props.course.clbid)
		}
		else {
			studentActions.addCourse(this.props.student.id, targetScheduleId, this.props.course.clbid)
		}
	}

	render() {
		const course = this.props.course

		return (
			<div>
				<BasicCourse className='info-wrapper' course={course} onClick={this.props.onClick} />
				<div className='details'>
					<dl>
						<dt>Locations</dt>
						<dd>{course.locations.join(' · ')}</dd>

						<dt>Professors</dt>
						<dd>{oxford(course.instructors)}</dd>

						{course.prerequisites ? <dt>Prerequisites</dt> : null}
						{course.prerequisites ? <dd>{course.prerequisites}</dd> : null}

						<dt>Course Description</dt>
						<dd>{course.desc}</dd>
					</dl>
					<p>Offered in {semesterName(course.semester)} {course.year}. {course.credits} {plur('credit', course.credits)}.</p>
				</div>
				<div className='tools'>
					<select className='semester-select' value={this.props.schedule ? this.props.schedule.id : null} onChange={this.moveToSchedule}>
						{map(findSemesterList(this.props.student), (group, key) => (
							<optgroup key={key} label={expandYear(key, true, '–')}>
								{(map(group, sched =>
									<option value={sched.id} key={sched.id}>{sched.title}</option>))}
							</optgroup>
						))}
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

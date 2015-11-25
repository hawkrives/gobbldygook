import React, {Component, PropTypes} from 'react'
import map from 'lodash/collection/map'
import flatten from 'lodash/array/flatten'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import cx from 'classnames'

import Button from './button'
import CourseTitle from './course-title'
import CourseIdentBlock from './course-ident-block'

import studentActions from '../flux/student-actions'
import semesterName from '../helpers/semester-name'
import expandYear from '../helpers/expand-year'
import to12Hour from '../helpers/to-12-hour-time'

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
		children: PropTypes.node,
		className: PropTypes.string,
		course: PropTypes.object.isRequired,
		schedule: PropTypes.object,
		student: PropTypes.object.isRequired,
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
			<div className={cx(this.props.className)}>
				<div className='info-wrapper'>
					<CourseTitle {...course} />

					<div className='summary'>
						<CourseIdentBlock {...course} />
						<span className='type'>{course.type}</span>
					</div>
				</div>

				<div className='columns'>
					<div className='column'>
						{this.props.children}

						{course.desc && <div className='description'>
							<h2>Description</h2>
							<p>{course.desc}</p>
						</div>}

						<p>
							Offered in {semesterName(course.semester)} {course.year}.{' '}
							{course.credits} {plur('credit', course.credits)}.
						</p>
					</div>
					<div className='column'>
						{course.prerequisites && <div>
							<h2>Prerequisites</h2>
							<p>{course.prerequisites}</p>
						</div>}

						{course.times && <div>
							<h2>{plur('Offering', course.offerings.length)}</h2>
							<ul>
								{flatten(map(course.offerings, (o, i) =>
									map(o.times, (t, j) =>
											<li key={`${i}-${j}`}>{o.day} from {to12Hour(t.start)} to {to12Hour(t.end)}, in {o.location}</li>)
										))}
							</ul>
						</div>}

						{course.instructors && <div>
							<h2>{plur('Instructor', course.instructors.length)}</h2>
							<div>{oxford(course.instructors)}</div>
						</div>}

						{course.gereqs && <div>
							<h2>G.E. Requirements</h2>
							<ul className='gereqs'>
								{map(course.gereqs, (ge, idx) =>
									<li key={ge + idx}>{ge}</li>
								)}
							</ul>
						</div>}
					</div>
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

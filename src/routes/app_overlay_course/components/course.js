import React, {PropTypes} from 'react'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import groupBy from 'lodash/collection/groupBy'
import flatten from 'lodash/array/flatten'
import {oxford} from 'humanize-plus'
import plur from 'plur'

import Button from '../../../components/button'
import CourseTitle from '../../../components/course-title'
import buildCourseIdent from '../../../helpers/build-course-ident'

import semesterName from '../../../helpers/semester-name'
import expandYear from '../../../helpers/expand-year'
import to12Hour from '../../../helpers/to-12-hour-time'

function findSemesterList(student) {
	let schedules = map(student.schedules, s => ({
		...s, title: `${semesterName(s.semester)} – ${s.title}`,
	}))

	let sorted = sortBy(schedules, ['year', 'semester'])
	let byYear = groupBy(sorted, 'year')

	return byYear
}

const removeFromSemester = ({studentId, removeCourse, clbid, scheduleId}) => () => {
	removeCourse(studentId, scheduleId, clbid)
}

function moveToSchedule({moveCourse, addCourse}) {
	return ({scheduleId, studentId, clbid}) => ev => {
		const targetScheduleId = ev.target.value
		if (targetScheduleId == 'none') {
			return
		}

		if (scheduleId) {
			moveCourse(studentId, scheduleId, targetScheduleId, clbid)
		}
		else {
			addCourse(studentId, targetScheduleId, clbid)
		}
	}
}


function SemesterSelector({scheduleId, student, moveCourse, addCourse}) {
	return (
		<select
			className='semester-select'
			value={scheduleId || 'none'}
			disabled={!Boolean(student)}
			onChange={moveToSchedule({moveCourse, addCourse})}
		>
			<option value='none'>No Schedule</option>
			{Boolean(student) ? map(findSemesterList(student), (group, key) => (
				<optgroup key={key} label={expandYear(key, true, '–')}>
					{(map(group, sched =>
						<option value={sched.id} key={sched.id}>{sched.title}</option>))}
				</optgroup>
			)) : null}
		</select>
	)
}

SemesterSelector.propTypes = {
	addCourse: PropTypes.function,
	moveCourse: PropTypes.function,
	removeCourse: PropTypes.function,
	scheduleId: PropTypes.string,
	student: PropTypes.object,
}


export default function CourseOverlay(props) {
	const {
		course,
		student,
		scheduleId,
		removeCourse,
		addCourse,
		moveCourse,
	} = props

	return (
		<div>
			<div className='info-wrapper'>
				<CourseTitle {...course} />

				<div className='summary'>
					<span className='identifier'>
						{buildCourseIdent(course)}
					</span>
					<span className='type'>{course.type}</span>
				</div>
			</div>

			<div className='columns'>
				<div className='column'>
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
				<SemesterSelector scheduleId={scheduleId} student={student} moveCourse={moveCourse} addCourse={addCourse} />
				<Button className='remove-course'
					onClick={removeFromSemester({studentId: student.id, removeCourse, clbid: course.clbid, scheduleId})}
					disabled={!Boolean(this.props.scheduleId) || !Boolean(this.props.student)}>
					Remove Course
				</Button>
			</div>
		</div>
	)
}

CourseOverlay.propTypes = {
	addCourse: PropTypes.function,
	course: PropTypes.object.isRequired,
	moveCourse: PropTypes.function,
	removeCourse: PropTypes.function,
	scheduleId: PropTypes.string,
	student: PropTypes.object,
}

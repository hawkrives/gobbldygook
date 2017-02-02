import React, { PropTypes } from 'react'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import oxford from 'listify'
import plur from 'plur'

import Modal from '../../components/modal'
import Separator from '../../components/separator'
import Toolbar from '../../components/toolbar'
import Button from '../../components/button'
import CourseTitle from './course-title'
import { semesterName, expandYear } from '../../../school-st-olaf-college/course-info'
import { buildDeptNum } from '../../../school-st-olaf-college/deptnums'

import { to12HourTime } from '../../../lib'

import { bindActionCreators } from 'redux'
const { connect } = require('react-redux')
import { addCourse, moveCourse, removeCourse } from '../../redux/students/actions/courses'

import './modal-course.scss'

function findSemesterList(student) {
	let schedules = map(student.schedules, s => ({
		...s, title: `${semesterName(s.semester)} – ${s.title}`,
	}))

	let sorted = sortBy(schedules, ['year', 'semester'])
	let byYear = groupBy(sorted, 'year')

	return byYear
}

const removeFromSemester = ({ studentId, removeCourse, clbid, scheduleId }) => () => {
	if (studentId) {
		removeCourse(studentId, scheduleId, clbid)
	}
}

function moveToSchedule({ ev, moveCourse, addCourse, removeCourse, scheduleId, studentId, clbid }) {
	const targetScheduleId = ev.target.value
	if (targetScheduleId === '$none') {
		return
	}
	else if (targetScheduleId === '$remove') {
		return removeCourse(studentId, scheduleId, clbid)
	}

	if (scheduleId) {
		return moveCourse(studentId, scheduleId, targetScheduleId, clbid)
	}
	else {
		return addCourse(studentId, targetScheduleId, clbid)
	}
}


function SemesterSelector({ scheduleId, student, moveCourse, addCourse, removeCourse, clbid }) {
	return (
		<select
			className="semester-select"
			value={scheduleId || 'none'}
			disabled={!student || !clbid}
			onChange={ev => moveToSchedule({ ev, moveCourse, addCourse, removeCourse, scheduleId, studentId: student.id, clbid })}
		>
			{scheduleId
				? <option value="$remove">Remove from Schedule</option>
				: <option value="$none">No Schedule</option>}
			{student ? map(findSemesterList(student), (group, key) => (
				<optgroup key={key} label={expandYear(key, true, '–')}>
					{(map(group, sched =>
						<option value={sched.id} key={sched.id}>{sched.title}</option>))}
				</optgroup>
			)) : null}
		</select>
	)
}

SemesterSelector.propTypes = {
	addCourse: PropTypes.func.isRequired,
	clbid: PropTypes.number,
	moveCourse: PropTypes.func.isRequired,
	removeCourse: PropTypes.func.isRequired,
	scheduleId: PropTypes.string,
	student: PropTypes.object,
}


function ModalCourse(props) {
	const {
		course,
		student,
		studentId,
		scheduleId,
		removeCourse,
		addCourse,
		moveCourse,
		onClose,
	} = props

	return (
		<Modal onClose={onClose} contentLabel="Course">
		<div className="course--modal">
			<Toolbar>
				<Separator type="flex-spacer" flex={3} />
				<Button type="raised" onClick={onClose}>Close</Button>
			</Toolbar>
			<div className="info-wrapper">
				<CourseTitle {...course} />

				<div className="summary">
					<span className="identifier">
						{buildDeptNum(course, true)}
					</span>
					{' • '}
					<span className="type">{course.type}</span>
				</div>
			</div>

			<div className="columns">
				<div className="column">
					{course.desc && <div className="description">
						<h2>Description</h2>
						<p>{course.desc}</p>
					</div>}

					<p>
						Offered in {semesterName(course.semester)} {course.year}.{' '}
						{course.credits} {plur('credit', course.credits)}.
					</p>
				</div>
				<div className="column">
					{course.prerequisites && <div>
						<h2>Prerequisites</h2>
						<p>{course.prerequisites}</p>
					</div>}

					{course.times && <div>
						<h2>{plur('Offering', course.offerings.length)}</h2>
						<ul>
							{flatMap(course.offerings, (o, i) =>
								map(o.times, (t, j) =>
									<li key={`${i}-${j}`}>{o.day} from {to12HourTime(t.start)} to {to12HourTime(t.end)}, in {o.location}</li>)
								)}
						</ul>
					</div>}

					{course.instructors && <div>
						<h2>{plur('Instructor', course.instructors.length)}</h2>
						<div>{oxford(course.instructors)}</div>
					</div>}

					{course.gereqs && <div>
						<h2>G.E. Requirements</h2>
						<ul className="gereqs">
							{map(course.gereqs, (ge, idx) =>
								<li key={ge + idx}>{ge}</li>
							)}
						</ul>
					</div>}
				</div>
			</div>

			<div className="tools">
				<SemesterSelector
					scheduleId={scheduleId}
					student={student}
					moveCourse={moveCourse}
					addCourse={addCourse}
					removeCourse={removeCourse}
					clbid={course.clbid}
				/>
				<Button className="remove-course"
					onClick={removeFromSemester({ studentId, removeCourse, clbid: course.clbid, scheduleId })}
					disabled={!scheduleId || !student}>
					Remove Course
				</Button>
			</div>
		</div>
		</Modal>
	)
}

ModalCourse.propTypes = {
	addCourse: PropTypes.func,  // redux
	course: PropTypes.object.isRequired,  // parent
	moveCourse: PropTypes.func,  // redux
	onClose: PropTypes.func.isRequired, // parent
	removeCourse: PropTypes.func,  // redux
	scheduleId: PropTypes.string,  // parent
	student: PropTypes.object,  // redux
	studentId: PropTypes.string,  // parent
}

const mapState = (state, ownProps) => {
	if (ownProps.studentId) {
		return {
			student: state.students[ownProps.studentId].data.present,
		}
	}
	return {}
}

const mapDispatch = dispatch => bindActionCreators({ addCourse, moveCourse, removeCourse }, dispatch)

export default connect(mapState, mapDispatch)(ModalCourse)

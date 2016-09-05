import test from 'ava'

import {
	default as Student,
	addScheduleToStudent,
	removeCourseFromSchedule,
} from '../student'

import Schedule from '../schedule'

test('removes a course', t => {
	const sched = Schedule({clbids: [123]})
	const stu = addScheduleToStudent(Student(), sched)
	let removedCourse = removeCourseFromSchedule(stu, sched.id, 123)
	t.false(removedCourse.schedules[sched.id].clbids.includes(123))
})

test('refuses to remove non-number clbids', t => {
	const sched = Schedule({clbids: [123]})
	const stu = addScheduleToStudent(Student(), sched)
	t.throws(() => removeCourseFromSchedule(stu, sched.id, '918'), TypeError)
})

test('returns a new object', t => {
	const sched = Schedule({clbids: [123]})
	const stu = addScheduleToStudent(Student(), sched)
	const actual = removeCourseFromSchedule(stu, sched.id, 123)
	t.not(actual, stu)
	t.not(actual.schedules[sched.id], stu.schedules[sched.id])
	t.not(actual.schedules[sched.id], sched)
})

test('returns the same student if the clbid does not exist in the schedule', t => {
	let sched = Schedule({clbids: []})
	let stu = addScheduleToStudent(Student(), sched)
	t.is(removeCourseFromSchedule(stu, sched.id, 123), stu)
})

test('throws an error if the schedule cannot be found', t => {
	let sched = Schedule({clbids: [456]})
	let stu = addScheduleToStudent(Student(), sched)
	t.throws(() => removeCourseFromSchedule(stu, sched.id + 'bad', 456), ReferenceError)
})

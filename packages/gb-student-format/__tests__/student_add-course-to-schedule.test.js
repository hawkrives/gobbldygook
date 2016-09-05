import test from 'ava'

import {
	default as Student,
	addScheduleToStudent,
	addCourseToSchedule,
} from '../student'

import Schedule from '../schedule'

test('adds a course', t => {
	const sched = Schedule()
	const stu = addScheduleToStudent(Student(), sched)
	let addedCourse = addCourseToSchedule(stu, sched.id, 918)
	t.true(addedCourse.schedules[sched.id].clbids.includes(918))
})

test('refuses to add non-number clbids', t => {
	const sched = Schedule()
	const stu = addScheduleToStudent(Student(), sched)
	t.throws(() => addCourseToSchedule(stu, sched.id, '918'), TypeError)
})

test('returns a new object', t => {
	const sched = Schedule()
	const stu = addScheduleToStudent(Student(), sched)
	let actual = addCourseToSchedule(stu, sched.id, 918)
	t.not(actual, stu)
	t.not(actual.schedules[sched.id], stu.schedules[sched.id])
	t.not(actual.schedules[sched.id], sched)
})

test('returns the same student if the clbid already exists in the schedule', t => {
	const sched = Schedule({clbids: [456]})
	const stu = addScheduleToStudent(Student(), sched)
	t.is(addCourseToSchedule(stu, sched.id, 456), stu)
})

test('throws an error if the schedule cannot be found', t => {
	let sched = Schedule({clbids: [456]})
	let stu = addScheduleToStudent(Student(), sched)
	t.throws(() => addCourseToSchedule(stu, sched.id + 'bad', 456), ReferenceError)
})

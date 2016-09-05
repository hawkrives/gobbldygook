import test from 'ava'

import {
	default as Student,
	addScheduleToStudent,
	reorderCourseInSchedule,
} from '../student'

import Schedule from '../schedule'

test('rearranges courses', t => {
	const sched = Schedule({clbids: [123, 456, 789]})
	const stu = addScheduleToStudent(Student(), sched)
	let rearranged = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: 1})
	t.notDeepEqual(rearranged.schedules[sched.id].clbids, [123, 456, 789])
	t.deepEqual(rearranged.schedules[sched.id].clbids, [456, 123, 789])
})

test('requires that the clbid be a number', t => {
	const sched = Schedule({clbids: [123, 456, 789]})
	const stu = addScheduleToStudent(Student(), sched)
	t.throws(() => reorderCourseInSchedule(stu, sched.id, {clbid: '123', index: 1}), TypeError)
})

test('returns a new object', t => {
	const sched = Schedule({clbids: [123, 456, 789]})
	const stu = addScheduleToStudent(Student(), sched)
	let actual = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: 1})
	t.not(actual, stu)
	t.not(actual.schedules[sched.id], stu.schedules[sched.id])
	t.not(actual.schedules[sched.id], sched)
})

test('requires that the clbid to be moved actually appear in the list of clbids', t => {
	const sched = Schedule({clbids: [123, 456, 789]})
	const stu = addScheduleToStudent(Student(), sched)
	t.throws(() => reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: 0}), ReferenceError)
})

test('throws if the schedule id cannot be found', t => {
	let sched = Schedule({clbids: [123456789, 123]})
	let stu = {schedules: {[sched.id]: sched}}
	t.throws(() => reorderCourseInSchedule(stu, sched.id + 'bad', {clbid: 123, index: 0}), ReferenceError)
})

test('truncates the requested index if it is greater than the number of courses', t => {
	let sched = Schedule({clbids: [123456789, 123]})
	let stu = {schedules: {[sched.id]: sched}}
	let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: 10})
	t.is(reordered.schedules[sched.id].clbids.indexOf(123456789), 1)
})

test('truncates the requested index if it is Infinity', t => {
	let sched = Schedule({clbids: [123456789, 123]})
	let stu = {schedules: {[sched.id]: sched}}
	let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123456789, index: Infinity})
	t.is(reordered.schedules[sched.id].clbids.indexOf(123456789), 1)
})

test('truncates the requested index if it is less than 0', t => {
	let sched = Schedule({clbids: [123456789, 123]})
	let stu = {schedules: {[sched.id]: sched}}
	let reordered = reorderCourseInSchedule(stu, sched.id, {clbid: 123, index: -10})
	t.is(reordered.schedules[sched.id].clbids.indexOf(123), 0)
})

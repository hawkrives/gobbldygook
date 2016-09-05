import test from 'ava'

import {
	renameScheduleInStudent,
} from '../student'

import Schedule from '../schedule'

test('renames the schedule', t => {
	let sched = Schedule({title: 'Initial Title'})
	let stu = {schedules: {[sched.id]: sched}}
	let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
	t.is(newOrder.schedules[sched.id].title, 'My New Title')
})

test('returns a new object', t => {
	let sched = Schedule({title: 'Initial Title'})
	let stu = {schedules: {[sched.id]: sched}}
	let newOrder = renameScheduleInStudent(stu, sched.id, 'My New Title')
	t.not(newOrder, stu)
	t.not(newOrder.schedules[sched.id], sched)
})

test('throws if the schedule id cannot be found', t => {
	let sched = Schedule()
	let stu = {schedules: {}}
	t.throws(() => renameScheduleInStudent(stu, sched.id, 'third'), ReferenceError)
})

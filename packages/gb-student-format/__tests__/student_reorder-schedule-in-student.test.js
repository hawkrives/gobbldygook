import test from 'ava'

import {
	reorderScheduleInStudent,
} from '../student'

import Schedule from '../schedule'

test('changes the "index" property', t => {
	let sched = Schedule({index: 0})
	let stu = {schedules: {[sched.id]: sched}}
	let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
	t.is(newOrder.schedules[sched.id].index, 5)
})

test('returns a new object', t => {
	let sched = Schedule({index: 0})
	let stu = {schedules: {[sched.id]: sched}}
	let newOrder = reorderScheduleInStudent(stu, sched.id, 5)
	t.not(newOrder, stu)
	t.not(newOrder.schedules[sched.id], sched)
})

test('throws if the schedule id cannot be found', t => {
	let sched = Schedule()
	let stu = {schedules: {}}
	t.throws(() => reorderScheduleInStudent(stu, sched.id, 3), ReferenceError)
})

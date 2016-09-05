import test from 'ava'

import {
	default as Student,
	addScheduleToStudent,
	destroyScheduleFromStudent,
} from '../student'

import Schedule from '../schedule'

test('removes schedules', t => {
	const sched = Schedule()
	const stu = addScheduleToStudent(Student(), sched)
	let removedSchedule = destroyScheduleFromStudent(stu, sched.id)
	t.is(removedSchedule.schedules[sched.id], undefined)
})

test('makes another schedule active if there is another schedule available for the same term', t => {
	const sched1 = Schedule({year: 2012, semester: 1, index: 1, active: true})
	const sched2 = Schedule({year: 2012, semester: 1, index: 2})
	let stu = Student()
	stu = addScheduleToStudent(stu, sched1)
	stu = addScheduleToStudent(stu, sched2)

	let removedSchedule = destroyScheduleFromStudent(stu, sched1.id)
	t.true(removedSchedule.schedules[sched2.id].active)
})

test('requires that the student\'s schedules not be in an array', t => {
	const sched = Schedule()
	const stu = {schedules: [sched]}
	let shouldThrowBecauseArray = () => destroyScheduleFromStudent(stu, sched.id)
	t.throws(shouldThrowBecauseArray, TypeError)
})

test('throws if it cannot find the requested schedule id', t => {
	const sched = Schedule()
	const stu = {schedules: {}}
	let shouldThrowBecauseNotAdded = () => destroyScheduleFromStudent(stu, sched.id)
	t.throws(shouldThrowBecauseNotAdded, ReferenceError)
})

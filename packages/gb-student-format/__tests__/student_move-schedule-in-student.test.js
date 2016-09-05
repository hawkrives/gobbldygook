import test from 'ava'

import {
	moveScheduleInStudent,
} from '../student'

import Schedule from '../schedule'

test('throws if not given anywhere to move to', t => {
	t.throws(() => moveScheduleInStudent({}, '', {}), RangeError)
})

test('moves just a year', t => {
	let sched = Schedule({year: 2012})
	let stu = {schedules: {[sched.id]: sched}}
	let actual = moveScheduleInStudent(stu, sched.id, {year: 2014})
	t.is(actual.schedules[sched.id].year, 2014)
})

test('moves just a semester', t => {
	let sched = Schedule({semester: 1})
	let stu = {schedules: {[sched.id]: sched}}
	let actual = moveScheduleInStudent(stu, sched.id, {semester: 3})
	t.is(actual.schedules[sched.id].semester, 3)
})

test('moves both a year and a semester', t => {
	let sched = Schedule({year: 2012, semester: 1})
	let stu = {schedules: {[sched.id]: sched}}
	let actual = moveScheduleInStudent(stu, sched.id, {year: 2014, semester: 3})
	t.is(actual.schedules[sched.id].year, 2014)
	t.is(actual.schedules[sched.id].semester, 3)
})

test('throws if year is not a number', t => {
	let sched = Schedule()
	let stu = {schedules: {[sched.id]: sched}}
	t.throws(() => moveScheduleInStudent(stu, sched.id, {year: '2014'}), TypeError)
})

test('throws if semester is not a number', t => {
	let sched = Schedule()
	let stu = {schedules: {[sched.id]: sched}}
	t.throws(() => moveScheduleInStudent(stu, sched.id, {semester: '5'}), TypeError)
})

test('returns a new object', t => {
	let sched = Schedule({year: 2012})
	let actual = moveScheduleInStudent({schedules: {[sched.id]: sched}}, sched.id, {year: 2014})
	t.not(actual.schedules[sched.id], sched)
})

test('throws if the schedule id cannot be found', t => {
	let sched = Schedule()
	let stu = {schedules: {}}
	t.throws(() => moveScheduleInStudent(stu, sched.id, {year: 2000}), ReferenceError)
})

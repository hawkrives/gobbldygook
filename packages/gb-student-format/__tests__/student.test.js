import test from 'ava'
import demoStudent from '../demo-student.json'
import stringify from 'json-stable-stringify'

import {default as Student} from '../student'

import Schedule from '../schedule'

test('returns an object', t => {
	t.is(typeof Student(), 'object')
})

test('creates a unique ID for each new student without an ID prop', t => {
	let stu1 = Student()
	let stu2 = Student()
	t.not(stu1.id, stu2.id)
})

test('holds a student', t => {
	const stu = Student(demoStudent)

	t.truthy(stu)
	t.truthy(stu.id)
	t.is(stu.matriculation, 2012)
	t.is(stu.graduation, 2016)
	t.is(stu.creditsNeeded, 35)
	t.deepEqual(stu.studies, demoStudent.studies)
	t.deepEqual(stu.schedules, demoStudent.schedules)
	t.deepEqual(stu.fabrications, demoStudent.fabrications)
	t.deepEqual(stu.settings, demoStudent.settings)
	t.deepEqual(stu.overrides, demoStudent.overrides)
})

test('turns into JSON', t => {
	const stu = Student()
	let result = stringify(stu)
	t.truthy(result)
})

test('migrates an array of schedules into an object', t => {
	const schedules = [Schedule({id: '1'}), Schedule({id: '2'})]
	const stu = Student({schedules})
	t.true('2' in stu.schedules)
	t.deepEqual(stu.schedules['2'], schedules[1])
})

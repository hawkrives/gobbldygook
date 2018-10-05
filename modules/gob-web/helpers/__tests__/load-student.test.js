// @flow

import {loadStudent} from '../load-student'
const demoStudent = require('@gob/object-student/demo-student.json')

import {Student} from '@gob/object-student'
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn())

describe('loadStudent', () => {
	let student
	beforeEach(() => {
		student = new Student(demoStudent)
		localStorage.clear()
		localStorage.setItem(student.id, JSON.stringify(student))
	})

	it('loads a student', async () => {
		const actual = await loadStudent(student.id)
		expect(actual).toBeTruthy()
		expect(actual).toHaveProperty('id')
	})

	it('returns a fresh student if it is null', async () => {
		localStorage.removeItem(student.id)
		const actual = await loadStudent(student.id)
		expect(actual).toBeInstanceOf(Student)
	})

	it('returns a fresh student if it is the string [Object object]', async () => {
		localStorage.setItem(student.id, String({}))
		const actual = await loadStudent(student.id)
		expect(actual).toBeInstanceOf(Student)
	})

	it('returns a fresh student if JSON errors are encountered', async () => {
		localStorage.setItem(student.id, 'hello!')
		const actual = await loadStudent(student.id)
		expect(actual).toHaveProperty('id')
	})
})

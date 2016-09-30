import {expect} from 'chai'

import loadStudent from '../../src/helpers/load-student'
import demoStudent from '../../src/models/demo-student.json'

import mock from 'mock-require'
mock('../../src/helpers/get-courses', require('../../../__tests/mocks/get-courses.mock.js').default)
mock('../../src/helpers/load-area', require('../../../__tests/mocks/load-area.mock.js').default)
import Student from '../../src/models/student'

describe('loadStudent', () => {
	let student
	beforeEach(() => {
		student = Student(demoStudent)
		localStorage.clear()
		localStorage.setItem(student.id, JSON.stringify(student))
	})

	it('returns a promise', () => {
		expect(loadStudent(student.id)).to.have.property('then')
	})

	it('loads a student', async () => {
		const actual = await loadStudent(student.id)
		expect(actual).to.be.ok
		expect(actual).to.be.an.object
	})

	it(`removes the student if it is null`, async () => {
		localStorage.removeItem(student.id)
		const actual = await loadStudent(student.id)
		expect(actual).to.equal(null)
	})

	it(`removes the student if it is the string [Object object]`, async () => {
		localStorage.setItem(student.id, String(student))
		const actual = await loadStudent(student.id)
		expect(actual).to.equal(null)
	})

	it('returns a fresh student if JSON errors are encountered', async () => {
		localStorage.setItem(student.id, 'hello!')
		const actual = await loadStudent(student.id)
		expect(actual).to.be.an.object
	})
})

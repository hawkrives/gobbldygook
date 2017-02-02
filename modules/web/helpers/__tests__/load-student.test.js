import { expect } from 'chai'

import { loadStudent } from '../load-student'
import demoStudent from 'modules/object-student/demo-student.json'

import { Student } from 'modules/core'

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

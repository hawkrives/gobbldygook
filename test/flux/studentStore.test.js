// test/flux/studentStore.test.js
jest.dontMock('../../app/flux/studentStore')

describe('studentStore', () => {
	let studentStore = undefined
	beforeEach(() => {
		studentStore = require('../../app/flux/studentStore')
	})

	xit('creates itself correctly', () => {
		expect(studentStore.students).toBeDefined()
		expect(studentStore.history).toBeDefined()
		expect(studentStore.future).toBeDefined()
	})

	xit('supports undoing things')
	xit('supports redoing things')
	xit('will not let you go back to a previous future')

	xit('can reset a student to a demo state')
	xit('reloads all currently known students from storage')

	xit('loads students from storage')

	xit('creates new students')

	xit('passes methods that change students')
	xit('passes methods that alter things inside of students')
})

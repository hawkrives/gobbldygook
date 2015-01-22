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
})

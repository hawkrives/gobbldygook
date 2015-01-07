// tests/partialTitle-test.js
import {
	partialTitle,
	partialName,
	partialNameOrTitle} from 'app/helpers/partialTitle'

describe('partialTitle', () => {
	let courses = []

	beforeEach(() => {
		courses = [
			{title: 'AsianCon3: Interpreting Asia'},
			{title: 'Introduction to Modern Dance'},
			{title: 'Hello world!'},
			{title: 'Fubar.'},
			{title: 'Modern Japanese Literature'},
		]
		courses = courses.map((c) => {
			c.name = c.title
			return c
		})
	})

	it('checks if a course has a matching string in the title', () => {
		partialTitle('Asia', courses[0]).should.be.true
		partialTitle('Dance', courses[1]).should.be.true
		partialTitle('Japanese', courses[4]).should.be.true
	})

	it('checks if a course has a matching string in the name', () => {
		partialName('Asia', courses[0]).should.be.true
		partialName('Dance', courses[1]).should.be.true
		partialName('Japanese', courses[4]).should.be.true
	})

	it('checks if a course has a matching string in either the title or the name', () => {
		partialNameOrTitle('Asia', courses[0]).should.be.true
		partialNameOrTitle('Dance', courses[1]).should.be.true
		partialNameOrTitle('Japanese', courses[4]).should.be.true
		partialNameOrTitle('China', courses[4]).should.be.false
	})
})

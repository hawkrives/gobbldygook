// sto-areas/test/lib-countGeneds.test.js
import countGeneds from '../lib/countGeneds'

describe('Library - countGeneds', () => {
	it('counts the number of occurrences of a gened in a list of courses', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC']},
			{crsid: 2, gereqs: ['HWC']},
		]

		countGeneds(courses, 'HWC').should.equal(2)
	})

	it('shouldn\'t count other geneds', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC', 'ALS-L']},
			{crsid: 2, gereqs: ['HWC']},
		]

		countGeneds(courses, 'HWC').should.equal(2)
	})

	it('counts all FOL-* as FOL', () => {
		let courses = [
			{crsid: 1, gereqs: ['FOL-J']},
			{crsid: 2, gereqs: ['FOL-C']},
		]

		countGeneds(courses, 'FOL').should.equal(2)
	})

	it('de-duplicates the courses before checking for geneds', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC']},
			{crsid: 1, gereqs: ['HWC']},
		]

		countGeneds(courses, 'HWC').should.equal(1)
	})
})

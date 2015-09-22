import {expect} from 'chai'
import countGeneds from '../../src/helpers/count-geneds'

describe('countGeneds', () => {
	it('counts the number of occurrences of a gened in a list of courses', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC']},
			{crsid: 2, gereqs: ['HWC']},
		]

		expect(countGeneds(courses, 'HWC')).to.equal(2)
	})

	it('shouldn\'t count other geneds', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC', 'ALS-L']},
			{crsid: 2, gereqs: ['HWC']},
		]

		expect(countGeneds(courses, 'HWC')).to.equal(2)
	})

	it('counts all FOL-* as FOL', () => {
		let courses = [
			{crsid: 1, gereqs: ['FOL-J']},
			{crsid: 2, gereqs: ['FOL-C']},
		]

		expect(countGeneds(courses, 'FOL')).to.equal(2)
	})

	it('de-duplicates the courses before checking for geneds', () => {
		let courses = [
			{crsid: 1, gereqs: ['HWC']},
			{crsid: 1, gereqs: ['HWC']},
		]

		expect(countGeneds(courses, 'HWC')).to.equal(1)
	})
})

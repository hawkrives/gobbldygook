import {expect} from 'chai'
import {loadHtml} from './support'
import {parseHtml} from '../../parse-html'
import {extractStudentIds} from '../student-ids'

describe('extractStudentIds', () => {
	it('returns the student id', () => {
		const html = loadHtml('term-20151')
		const actual = extractStudentIds(html)
		const expected = [101010]
		expect(actual).to.deep.equal(expected)
	})

	it(`returns an empty list if no student ids were found`, () => {
		const html = parseHtml('<html />')
		const actual = extractStudentIds(html)
		const expected = []
		expect(actual).to.deep.equal(expected)
	})
})

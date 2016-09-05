import test from 'ava'
import {loadHtml} from './_support'
import parseHtml from '../../parse-html'
import {extractStudentIds} from '../student-ids'

test('returns the student id', t => {
	const html = loadHtml('term-20151')
	const actual = extractStudentIds(html)
	const expected = [101010]
	t.deepEqual(actual, expected)
})

test(`returns an empty list if no student ids were found`, t => {
	const html = parseHtml('<html />')
	const actual = extractStudentIds(html)
	const expected = []
	t.deepEqual(actual, expected)
})

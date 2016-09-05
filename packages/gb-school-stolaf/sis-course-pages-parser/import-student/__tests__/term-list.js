import test from 'ava'
import {loadHtml} from './_support'
import {extractTermList} from '../term-list'

test('returns the list of terms', t => {
	const html = loadHtml('term-20151')
	const actual = extractTermList(html)
	const expected = [20153, 20152, 20151, 20143, 20142, 20141, 20133, 20132, 20131, 20123, 20122, 20121, 20119]
	t.deepEqual(actual, expected)
})

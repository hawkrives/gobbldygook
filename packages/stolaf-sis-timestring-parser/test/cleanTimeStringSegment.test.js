import test from 'ava'
import 'babel-core/register'
import cleanTimeStringSegment from '../src/cleanTimeStringSegment'

test('cleanTimeStringSegment trims up a timestring segment', t => {
	const expected = '800AM'
	const actual = cleanTimeStringSegment('    800AM   ')
	t.is(actual, expected)
})

test('cleanTimeStringSegment capitalizes a timestring segment', t => {
	const expected = '800AM'
	const actual = cleanTimeStringSegment('800am')
	t.is(actual, expected)
})

import test from 'ava'
import {findMissingNumberBinarySearch as missing} from '../find-missing-number-binary-search'

test('takes a list of numbers and finds the first gap', t => {
	t.is(missing([1, 2, 3]), null)
	t.not(missing([1, 2, 3]), 4)
})

test('returns null if there is no gap', t => {
	t.is(missing([0, 1, 2]), null)
})

test('returns the high-end of a multi-numer gap', t => {
	// I mean, ideally this would return 1, but for now...
	t.is(missing([0, 3, 4]), 2)
	t.not(missing([0, 3, 4]), 1)
})

import test from 'ava'
import {interpose} from '../interpose'

test('finds a random letter/number between the parameters', t => {
	let actual = interpose([1, 2, 3], 'a')
	let expected = [1, 'a', 2, 'a', 3]
	t.deepEqual(actual, expected)
})

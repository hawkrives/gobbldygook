import test from 'ava'
import {zipToObjectWithArrays} from '../zip-to-object-with-arrays'

test('parses area ids', t => {
	let keys = [4, 3, 2, 1]
	let vals = [1, 2, 3, 4]
	let actual = zipToObjectWithArrays(keys, vals)
	let expected = {4: [1], 3: [2], 2: [3], 1: [4]}
	t.deepEqual(actual, expected)
})


test('zips two arrays into an object, where the values are always arrays', t => {
	let keys = [4, 3, 2, 1]
	let vals = [[1], 2, 3, 4]

	let actual = zipToObjectWithArrays(keys, vals)
	let expected = {4: [[1]], 3: [2], 2: [3], 1: [4]}
	t.deepEqual(actual, expected)
})

import test from 'ava'
import {partitionByIndex} from '../partition-by-index'

test('partitions an array based on odd/even indices', t => {
	let arr = [1, 2, 3, 4, 5]
	let expected = [[1, 3, 5], [2, 4]]
	let actual = partitionByIndex(arr)
	t.deepEqual(actual, expected)
})

import test from 'ava'
import './_support/localstorage.mock'

import {setIdCache} from '../save-student'

test.beforeEach(() => {
	localStorage.clear()
})

test('sets the list of student ids', t => {
	localStorage.clear()
	const ids = ['1', '2', '3']
	setIdCache(ids)
	let actual = JSON.parse(localStorage.getItem('studentIds'))
	let expected = ids
	t.deepEqual(actual, expected)
})

import test from 'ava'
import './_support/localstorage.mock'

import {getIdCache} from '../save-student'

test.beforeEach(() => {
	localStorage.clear()
})

test('gets the list of student ids', t => {
	const ids = ['1', '2', '3']
	localStorage.setItem('studentIds', JSON.stringify(ids))
	t.deepEqual(getIdCache(), ids)
})

test('returns an empty array when there are no ids in the cache', t => {
	t.deepEqual(getIdCache(), [])
})

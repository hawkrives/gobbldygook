import test from 'ava'
import './_support/localstorage.mock'

import reject from 'lodash/reject'
import {removeStudentFromCache} from '../save-student'

test.beforeEach(t => {
	t.context.ids = ['1', '2', '3']
	localStorage.clear()
	localStorage.setItem('studentIds', JSON.stringify(t.context.ids))
})

test('removes an id from the list of student ids', t => {
	removeStudentFromCache('1')
	let expected = reject(t.context.ids, id => id === '1')
	let actual = JSON.parse(localStorage.getItem('studentIds'))
	t.deepEqual(actual, expected)
})

test('does not throw if the id does not exist', t => {
	removeStudentFromCache('300')
	let expected = t.context.ids
	let actual = JSON.parse(localStorage.getItem('studentIds'))
	t.deepEqual(actual, expected)
})

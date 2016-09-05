import test from 'ava'
import './_support/localstorage.mock'

import {addStudentToCache} from '../save-student'

test.beforeEach(t => {
	t.context.ids = ['1', '2', '3']
	localStorage.clear()
	localStorage.setItem('studentIds', JSON.stringify(t.context.ids))
})

test('adds an id to the list of student ids', t => {
	addStudentToCache('5')
	let expected = t.context.ids.concat(['5'])
	let actual = JSON.parse(localStorage.getItem('studentIds'))
	t.deepEqual(actual, expected)
})

test('does not add an id if one already exists', t => {
	addStudentToCache('3')
	let expected = t.context.ids
	let actual = JSON.parse(localStorage.getItem('studentIds'))
	t.deepEqual(actual, expected)
})

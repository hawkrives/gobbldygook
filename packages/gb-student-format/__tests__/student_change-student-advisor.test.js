import test from 'ava'

import {
	default as Student,
	changeStudentAdvisor,
} from '../student'

test('changes the student\'s advisor', t => {
	let initial = Student()
	t.is(
		changeStudentAdvisor(initial, 'professor name').advisor,
		'professor name')
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentAdvisor(initial, 'new advisor')
	t.not(final, initial)
})

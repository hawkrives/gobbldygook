import test from 'ava'

import {
	default as Student,
	changeStudentGraduation,
} from '../student'

test('changes the student\'s graduation year', t => {
	let initial = Student()
	t.is(
		changeStudentGraduation(initial, 2100).graduation,
		2100)
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentGraduation(initial, 1)
	t.not(final, initial)
})

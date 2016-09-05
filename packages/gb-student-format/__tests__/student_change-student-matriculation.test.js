import test from 'ava'

import {
	default as Student,
	changeStudentMatriculation,
} from '../student'


test('changes the student\'s matriculation year', t => {
	let initial = Student()
	t.is(
		changeStudentMatriculation(initial, 1800).matriculation,
		1800)
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentMatriculation(initial, 1)
	t.not(final, initial)
})

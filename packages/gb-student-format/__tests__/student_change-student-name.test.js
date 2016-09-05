import test from 'ava'

import {
	default as Student,
	changeStudentName,
} from '../student'

test('changes the student\'s name', t => {
	let initial = Student()
	t.is(changeStudentName(initial, 'my name').name,
		'my name')
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentName(initial, 'new name')
	t.not(final, initial)
})

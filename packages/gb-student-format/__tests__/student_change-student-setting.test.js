import test from 'ava'

import {
	default as Student,
	changeStudentSetting,
} from '../student'

test('changes settings in the student', t => {
	let initial = Student()
	t.deepEqual(
		changeStudentSetting(initial, 'key', 'value').settings,
		{key: 'value'})
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentSetting(initial, 'key', 'value2')
	t.not(final, initial)
})

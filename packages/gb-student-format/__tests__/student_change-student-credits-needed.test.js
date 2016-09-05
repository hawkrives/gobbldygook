import test from 'ava'

import {
	default as Student,
	changeStudentCreditsNeeded,
} from '../student'



test('changes the student\'s number of credits needed', t => {
	let initial = Student()
	t.is(
		changeStudentCreditsNeeded(initial, 130).creditsNeeded,
		130)
})

test('returns a new object', t => {
	let initial = Student()
	let final = changeStudentCreditsNeeded(initial, 1)
	t.not(final, initial)
})

import test from 'ava'

import {
	default as Student,
	setOverrideOnStudent,
} from '../student'

test('adds overrides', t => {
	const stu = Student()
	let addedOverride = setOverrideOnStudent(stu, 'nothing', 'me!')
	t.is(addedOverride.overrides['nothing'], 'me!')
})

test('sets overrides to falsy values if asked', t => {
	const stu = Student()
	let addedOverride = setOverrideOnStudent(stu, 'nothing', false)
	t.false(addedOverride.overrides['nothing'])
})

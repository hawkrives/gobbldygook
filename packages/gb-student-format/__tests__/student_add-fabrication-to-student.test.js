import test from 'ava'

import {
	default as Student,
	addFabricationToStudent,
} from '../student'

test('adds fabrications', t => {
	const stu = Student()
	const addedFabrication = addFabricationToStudent(stu, {clbid: '123'})
	t.deepEqual(addedFabrication.fabrications['123'], {clbid: '123'})
})

test('requires that fabrications include a clbid', t => {
	const stu = Student()
	const goodFab = {clbid: 'fab!', title: 'I\'m a fabrication!'}
	t.notThrows(() => addFabricationToStudent(stu, goodFab))
	const badFab = {title: "I'm a fabrication!"}
	t.throws(() => addFabricationToStudent(stu, badFab), ReferenceError)
})

test('requires that fabrication clbids be strings', t => {
	const stu = Student()
	const goodFab = {clbid: 'fab!', title: 'I\'m a fabrication!'}
	t.notThrows(() => addFabricationToStudent(stu, goodFab))
	const badFab = {clbid: 12345, title: 'I\'m a fabrication!'}
	t.throws(() => addFabricationToStudent(stu, badFab), TypeError)
})

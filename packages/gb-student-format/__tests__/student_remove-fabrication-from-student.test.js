import test from 'ava'
import demoStudent from '../demo-student.json'

import {
	default as Student,
	addFabricationToStudent,
	removeFabricationFromStudent,
} from '../student'

test('removes fabrications', t => {
	const stu = Student(demoStudent)
	let addedFabrication = addFabricationToStudent(stu, {clbid: '123'})
	let noMoreFabrication = removeFabricationFromStudent(addedFabrication, '123')
	t.false(noMoreFabrication.fabrications.hasOwnProperty('a'))
})

test('requires the fabricationId to be a string', t => {
	const stu = Student()
	const stuWithFab = addFabricationToStudent(stu, {clbid: 'fab!', title: 'I\'m a fabrication!'})
	t.throws(() => removeFabricationFromStudent(stuWithFab, 123), TypeError)
})

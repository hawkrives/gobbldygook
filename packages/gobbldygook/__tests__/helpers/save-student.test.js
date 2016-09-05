import test from 'ava'
import './_support/localstorage.mock'

import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import {v4 as uuid} from 'uuid'

import saveStudent from '../save-student'
import demoStudent from '../demo-student.json'

test.beforeEach(t => {
	const student = cloneDeep(demoStudent)
	student.id = uuid()
	Object.freeze(student)
	t.context.student = student
	localStorage.clear()
})

test('returns a promise', t => {
	let {student} = t.context
	t.true(saveStudent({id: student.id}) instanceof Promise)
})

test('saves a student', t => {
	let {student} = t.context
	saveStudent(student)

	let expectedStudentIds = [student.id]
	let actualStudentIds = JSON.parse(localStorage.getItem('studentIds'))
	t.deepEqual(actualStudentIds, expectedStudentIds)

	let expectedStudent = student
	let actualStudent = JSON.parse(localStorage.getItem(student.id))
	t.deepEqual(omit(actualStudent, 'dateLastModified'), expectedStudent)
})

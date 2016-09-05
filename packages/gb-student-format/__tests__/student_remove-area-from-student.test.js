import test from 'ava'
import demoStudent from '../demo-student.json'
import find from 'lodash/find'

import {
	default as Student,
	removeAreaFromStudent,
} from '../student'


test('removes areas', t => {
	const stu = Student(demoStudent)
	let query = {type: 'major', name: 'Computer Science', revision: 'latest'}
	let noCsci = removeAreaFromStudent(stu, query)
	t.is(find(noCsci.studies, query), undefined)
})

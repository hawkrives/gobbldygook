import test from 'ava'
import find from 'lodash/find'

import {
	default as Student,
	addAreaToStudent,
} from '../student'

test('adds areas', t => {
	const stu = Student()
	let query = {name: 'Exercise Science', type: 'major', revision: '2014-15'}
	let newArea = addAreaToStudent(stu, query)
	t.truthy(find(newArea.studies, query))
})

import test from 'ava'
import demoStudent from '../demo-student.json'

import {
	default as Student,
	removeOverrideFromStudent,
} from '../student'

test('removes overrides', t => {
	const stu = Student(demoStudent)
	let removedOverride = removeOverrideFromStudent(stu, 'credits.taken')
	t.falsy(removedOverride.overrides['credits.taken'])
})

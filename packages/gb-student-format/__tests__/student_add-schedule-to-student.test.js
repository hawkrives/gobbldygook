import test from 'ava'

import {
	default as Student,
	addScheduleToStudent,
} from '../student'

import Schedule from '../schedule'

test('adds schedules', t => {
	const stu = Student()
	let newSchedule = addScheduleToStudent(stu, Schedule({
		id: '10912',
		title: 'a',
		active: false,
		clbids: [],
		index: 1,
		semester: 0,
		year: 0,
	}))

	let actual = newSchedule.schedules['10912']
	let expected = {
		id: '10912',
		active: false,
		clbids: [],
		index: 1,
		semester: 0,
		title: 'a',
		year: 0,
		metadata: {},
	}
	t.deepEqual(actual, expected)
})

test('requires that the student\'s schedules not be in an array', t => {
	const stu = {schedules: []}
	let shouldThrowBecauseArray = () => addScheduleToStudent(stu, Schedule())
	t.throws(shouldThrowBecauseArray, TypeError)
})

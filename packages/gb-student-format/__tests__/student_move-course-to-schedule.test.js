import test from 'ava'
import demoStudent from '../demo-student.json'

import {
	default as Student,
	moveCourseToSchedule,
} from '../student'

test('moves courses between schedules in one-ish operation', t => {
	const stu = Student(demoStudent)
	let movedCourse = moveCourseToSchedule(stu, {fromScheduleId: '1', toScheduleId: '2', clbid: 82908})
	t.false(movedCourse.schedules['1'].clbids.includes(82908))
	t.true(movedCourse.schedules['2'].clbids.includes(82908))
})

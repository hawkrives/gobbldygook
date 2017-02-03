import forEach from 'lodash/forEach'
import range from 'lodash/range'
import size from 'lodash/size'

import { Student, Schedule, addScheduleToStudent } from '../../../../object-student'

import {
	INIT_STUDENT,
} from '../constants'

export function initStudent(raw) {
	let student = new Student(raw)

	if (size(student.schedules) === 0) {
		forEach(range(student.matriculation, student.graduation), year => {
			student = addScheduleToStudent(student, Schedule({ year, index: 1, active: true, semester: 1 }))
			student = addScheduleToStudent(student, Schedule({ year, index: 1, active: true, semester: 2 }))
			student = addScheduleToStudent(student, Schedule({ year, index: 1, active: true, semester: 3 }))
		})
	}

	return { type: INIT_STUDENT, payload: student }
}

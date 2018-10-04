// @flow

import {Range} from 'immutable'
import {Student, Schedule} from '@gob/object-student'
import {INIT_STUDENT} from '../constants'

type Action = {type: typeof INIT_STUDENT, payload: Student}

export type ActionCreator = any => Action

export const action: ActionCreator = (student: Student) => {
	if (student.schedules.size === 0) {
		Range(student.matriculation, student.graduation).forEach(year => {
			Range(1, 3).forEach(semester => {
				let sched = new Schedule({year, semester, active: true})
				student = student.addSchedule(sched)
			})
		})
	}

	return {type: INIT_STUDENT, payload: student}
}

import {find} from 'lodash'
import {filter} from 'lodash'
import {isCurrentSemester} from 'modules/core'

export function getSchedule(student, year, semester) {
	return find(
		filter(student.schedules, sched => sched.active),
		isCurrentSemester(year, semester))
}

import {find, filter} from 'lodash-es'
import isCurrentSemester from './is-current-semester'

export default function getSchedule(student, year, semester) {
	return find(
		filter(student.schedules, sched => sched.active),
		isCurrentSemester(year, semester))
}

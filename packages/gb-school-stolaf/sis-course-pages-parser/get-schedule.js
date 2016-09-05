import find from 'lodash/find'
import filter from 'lodash/filter'
import isCurrentSemester from 'gb-student-format/is-current-semester'

export default function getSchedule(student, year, semester) {
	return find(
		filter(student.schedules, sched => sched.active),
		isCurrentSemester(year, semester))
}

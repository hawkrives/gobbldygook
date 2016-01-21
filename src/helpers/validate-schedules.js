import mapValues from 'lodash/mapValues'
import validateSchedule from './validate-schedule'

export default async function validateSchedules(student) {
	let { schedules } = student
	schedules = mapValues(schedules, validateSchedule)
	return {...student, schedules}
}

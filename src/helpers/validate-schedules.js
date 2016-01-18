import mapValues from 'lodash/object/mapValues'
import validateSchedule from './validate-schedule'

export default function validateSchedules(student) {
	let { schedules } = student
	schedules = mapValues(schedules, validateSchedule)
	return Promise.resolve({...student, schedules})
}

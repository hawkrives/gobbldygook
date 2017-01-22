import mapValues from 'lodash/mapValues'
import { validateSchedule } from './validate-schedule'

export function validateSchedules(student) {
	return new Promise(resolve => {
		let { schedules } = student
		schedules = mapValues(schedules, validateSchedule)
		resolve({ ...student, schedules })
	})
}

import Bluebird from 'bluebird'
import mapValues from 'lodash/mapValues'
import {validateSchedule} from './validate-schedule'

export default function validateSchedules(student) {
	return new Bluebird(resolve => {
		let { schedules } = student
		schedules = mapValues(schedules, validateSchedule)
		resolve({...student, schedules})
	})
}

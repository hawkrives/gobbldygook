// @flow

import mapValues from 'lodash/mapValues'
import {validateSchedule} from './validate-schedule'

import type {StudentType} from './student'

export function validateSchedules(student: StudentType) {
	return new Promise(resolve => {
		let {schedules} = student
		schedules = mapValues(schedules, validateSchedule)
		resolve({...student, schedules})
	})
}

// @flow

import mapValues from 'lodash/mapValues'
import {validateSchedule} from './validate-schedule'

import type {HydratedStudentType} from './student'

export async function validateSchedules(student: HydratedStudentType) {
	let {schedules} = student
	schedules = mapValues(schedules, validateSchedule)
	return {...student, schedules}
}

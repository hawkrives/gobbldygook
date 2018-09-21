// @flow

import mapValues from 'lodash/mapValues'
import {validateSchedule} from './validate-schedule'

import type {StudentType} from './student'

export async function validateSchedules(student: StudentType) {
	let {schedules} = student
	schedules = mapValues(schedules, validateSchedule)
	return {...student, schedules}
}

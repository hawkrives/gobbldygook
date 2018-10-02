// @flow

import {validateSchedule} from './validate-schedule'

import type {StudentType} from './student'

export async function validateSchedules(student: StudentType) {
	return student.schedules.map(validateSchedule)
}

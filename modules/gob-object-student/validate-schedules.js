// @flow

import {validateSchedule} from './validate-schedule'

import {List} from 'immutable'
import {Schedule} from './schedule'
import {type OnlyCourseLookupFunc} from './types'

export async function validateSchedules(
	schedules: List<Schedule>,
	lookup: OnlyCourseLookupFunc,
) {
	return schedules.map(s => validateSchedule(s, lookup))
}

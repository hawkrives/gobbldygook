// @flow

import {type ScheduleType} from './schedule'

// Checks if a schedule is in a certain year and semester.
export function isCurrentSemester(year: number, semester: number) {
	return (schedule: ScheduleType) =>
		schedule.year === year && schedule.semester === semester
}

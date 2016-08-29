// @flow
import type {Schedule} from '../models/types'
/**
 * Checks if a schedule is in a certain year and semester.
 *
 * @param {Number} year - a year
 * @param {Number} semester - a semester
 * @returns {Boolean} - is the schedule part of the current semester
 */
export default function isCurrentSemester(year: number, semester: number) {
	return (schedule: Schedule) => (schedule.year === year) && (schedule.semester === semester)
}

import parseInt from 'lodash/string/parseInt'

/**
 * Checks if a schedule is in a certain year and semester.
 *
 * @param {Number} year - a year
 * @param {Number} semester - a semester
 * @param {Schedule} schedule - a schedule
 * @returns {Boolean} - is the schedule part of the current semester
 */
export default function isCurrentSemester(year, semester) {
	year = parseInt(year)
	semester = parseInt(semester)

	return schedule => (schedule.year === year) && (schedule.semester === semester)
}

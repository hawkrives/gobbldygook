/**
 * Checks if a schedule is in a certain year and semester.
 *
 * @param {Number} year - a year
 * @param {Number} semester - a semester
 * @returns {Boolean} - is the schedule part of the current semester
 */
export function isCurrentSemester(year, semester) {
	return schedule => (schedule.year === year) && (schedule.semester === semester)
}

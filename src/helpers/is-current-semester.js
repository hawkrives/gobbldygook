import curry from 'lodash/function/curry'
import parseInt from 'lodash/string/parseInt'

/**
 * Checks if a schedule is in a certain year and semester.
 *
 * @param {Number} year
 * @param {Number} semester
 * @param {Schedule} schedule
 * @returns {Boolean}
 */
let isCurrentSemester = curry((year=0, semester=0, schedule) => {
	year = parseInt(year)
	semester = parseInt(semester)

	return (schedule.year === year) && (schedule.semester === semester)
})

export default isCurrentSemester

import {curry} from 'lodash'

let isCurrentSemester = curry((year, semester, schedule) => {
	if ( typeof year === 'string')
		year = parseInt(year, 10)
	if ( typeof semester === 'string')
		semester = parseInt(semester, 10)
	return schedule.year === year && schedule.semester === semester
})

let isCurrentYear = curry((year, schedule) => {
	if ( typeof year === 'string')
		year = parseInt(year, 10)
	return schedule.year === year
})

export {isCurrentYear, isCurrentSemester}

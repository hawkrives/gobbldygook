import {forEach, merge, isArray, toArray} from 'lodash'
import findDays from './findDays'
import findTimes from './findTimes'

function convertTimeStringsToOfferings(course) {
	let offerings = {}

	forEach(course.times, function(time) {
		let daystring = time.split(' ')[0]
		let timestring = time.split(' ')[1]

		let days = findDays(daystring)
		let times = findTimes(timestring)

		forEach(days, function(day) {
			if (!offerings[day]) {
				offerings[day] = {}
			}

			merge(offerings[day], {day: day, times: [times]},
				(a, b) => isArray(a) ? a.concat(b) : undefined)
		})
	})

	return toArray(offerings)
}

export default convertTimeStringsToOfferings

// @flow
import assign from 'lodash/assign'
import mergeWith from 'lodash/mergeWith'
import values from 'lodash/values'
import zip from 'lodash/zip'
import findDays from './find-days'
import findTime from './find-time'

export default function convertTimeStringsToOfferings(course) {
	let offerings = {}

	zip(course.times, course.locations).forEach(([sisTimestring, location]) => {
		const [daystring, timestring] = sisTimestring.split(' ')

		const days = findDays(daystring)
		const time = findTime(timestring)

		days.forEach(day => {
			if (!offerings[day]) {
				offerings[day] = {}
			}

			let offering = {
				day: day,
				location: location,
				times: [assign({}, time)],
			}

			mergeWith(offerings[day], offering,
				(a, b) => Array.isArray(a) ? a.concat(b) : undefined)
		})
	})

	return values(offerings)
}

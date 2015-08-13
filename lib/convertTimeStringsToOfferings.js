import forEach from 'lodash.foreach'
import isArray from 'lodash.isarray'
import merge from 'lodash.merge'
import values from 'lodash.values'
import zip from 'lodash.zip'
import findDays from './findDays'
import findTime from './findTime'

export default function convertTimeStringsToOfferings(course) {
	let offerings = {}

	forEach(zip(course.times, course.locations), ([sisTimestring, location]) => {
		const [daystring, timestring] = sisTimestring.split(' ')

		const days = findDays(daystring)
		const time = findTime(timestring)

		forEach(days, day => {
			if (!offerings[day]) {
				offerings[day] = {}
			}

			let offering = {
				day: day,
				location: location,
				times: [time],
			}

			merge(offerings[day], offering,
				(a, b) => isArray(a) ? a.concat(b) : undefined)
		})
	})

	return values(offerings)
}

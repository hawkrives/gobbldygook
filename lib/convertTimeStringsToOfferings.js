import forEach from 'lodash.foreach'
import values from 'lodash.values'
import findDays from './findDays'
import findTime from './findTime'

export default function convertTimeStringsToOfferings(course) {
	let offerings = {}

	forEach(course.times, sisTimestring => {
		const [daystring, timestring] = sisTimestring.split(' ')

		const days = findDays(daystring)
		const time = findTime(timestring)

		forEach(days, day => {
			if (!offerings[day]) {
				offerings[day] = {
					day: day,
					times: [],
				}
			}

			offerings[day].times = offerings[day].times.concat({...time})
		})
	})

	return values(offerings)
}

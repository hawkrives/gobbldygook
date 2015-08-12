import forEach from 'lodash.foreach'
import values from 'lodash.values'
import findDays from './findDays'
import findTimes from './findTimes'

export default function convertTimeStringsToOfferings(course) {
	let offerings = {}

	forEach(course.times, time => {
		const [daystring, timestring] = time.split(' ')

		const days = findDays(daystring)
		const times = findTimes(timestring)

		forEach(days, day => {
			if (!offerings[day]) {
				offerings[day] = {
					day: '',
					times: [],
				}
			}

			offerings[day] = {
				day: day,
				times: offerings[day].times.concat([times]),
			}
		})
	})

	return values(offerings)
}

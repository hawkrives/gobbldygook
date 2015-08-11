import forEach from 'lodash/collection/forEach'
import values from 'lodash/object/values'
import findDays from './findDays'
import findTimes from './findTimes'
import _ from 'lodash'

export default function convertTimeStringsToOfferings(course) {
	let offerings = {}

	forEach(course.times, function(time) {
		const [daystring, timestring] = time.split(' ')

		const days = findDays(daystring)
		const times = findTimes(timestring)

		forEach(days, function(day) {
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

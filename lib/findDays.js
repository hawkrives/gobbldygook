import {contains, map} from 'lodash'
import daysOfTheWeek from './daysOfTheWeek'

function findDays(daystring) {
	let listOfDays = []

	if (contains(daystring, '-')) {
		// M-F, M-Th, T-F
		let sequence = ['M', 'T', 'W', 'Th', 'F']
		let [startDay, endDay] = daystring.split('-')
		listOfDays = sequence.slice(
			sequence.indexOf(startDay),
			sequence.indexOf(endDay) + 1
		)
	}
	else {
		// MTThFW or M/T/Th/F/W
		let spacedOutDays = daystring.replace(/([A-Z][a-z]?)\/?/g, '$1 ')
		// The regex sticks an extra space at the end. Remove it.
		spacedOutDays = spacedOutDays.substr(0, spacedOutDays.length - 1)
		listOfDays = spacedOutDays.split(' ')
	}

	// 'M' => 'Mo'
	return map(listOfDays, (day) => daysOfTheWeek[day])
}

export default findDays

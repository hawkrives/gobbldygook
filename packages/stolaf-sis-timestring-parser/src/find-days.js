// @flow
const daysOfTheWeek = {
	M: 'Mo',
	T: 'Tu',
	W: 'We',
	Th: 'Th',
	F: 'Fr',
}

const daySequence = ['M', 'T', 'W', 'Th', 'F']

export default function findDays(daystring: string): string[] {
	let listOfDays: string[] = []

	if (daystring.indexOf('-') !== -1) {
		// M-F, M-Th, T-F
		const [startDay, endDay] = daystring.split('-')
		listOfDays = daySequence.slice(
			daySequence.indexOf(startDay),
			daySequence.indexOf(endDay) + 1
		)
	}
	else {
		// MTThFW or M/T/Th/F/W
		let spacedOutDays: string = daystring.replace(/([A-Z][a-z]?)\/?/g, '$1 ')
		// The regex sticks an extra space at the end. Remove it.
		spacedOutDays = spacedOutDays.substr(0, spacedOutDays.length - 1)
		listOfDays = spacedOutDays.split(' ')
	}

	// 'M' => 'Mo'
	return listOfDays.map(day => daysOfTheWeek[day])
}

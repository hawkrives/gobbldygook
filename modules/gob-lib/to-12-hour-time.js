// @flow

import padStart from 'lodash/padStart'

function split24HourTime(time) {
	time = padStart(time, 5, '0')
	let [hour, minute] = time.split(':')
	return {
		hour: parseInt(hour, 10),
		minute: parseInt(minute, 10),
	}
}

export function to12HourTime(time: string): string {
	const {hour, minute} = split24HourTime(time)
	const paddedMinute = padStart(String(minute), 2, '0')

	const fullHour = ((hour + 11) % 12) + 1
	const meridian = hour < 12 ? 'am' : 'pm'

	return `${fullHour}:${paddedMinute}${meridian}`
}

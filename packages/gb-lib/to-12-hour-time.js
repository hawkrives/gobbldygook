// @flow
import padStart from 'lodash/padStart'

function split24HourTime(time: string): {hour: number, minute: number} {
	time = padStart(time, 4, '0')
	return {
		hour: parseInt(time.slice(0, 2)),
		minute: parseInt(time.slice(2, 4)),
	}
}

export function to12Hour(time: string): string {
	const {hour, minute} = split24HourTime(time)
	const paddedMinute = padStart(minute, 2, '0')

	const fullHour = ((hour + 11) % 12 + 1)
	const meridian = hour < 12 ? 'am' : 'pm'

	return `${fullHour}:${paddedMinute}${meridian}`
}

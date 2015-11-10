import padLeft from 'lodash/string/padLeft'

function split24HourTime(time) {
	time = padLeft(String(time), 4, '0')
	return {
		hour: parseInt(time.slice(0, 2)),
		minute: parseInt(time.slice(2, 4)),
	}
}

export default function to12Hour(time) {
	const {hour, minute} = split24HourTime(time)
	const paddedMinute = padLeft(minute, 2, '0')

	const fullHour = ((hour + 11) % 12 + 1)
	const meridian = hour < 12 ? 'am' : 'pm'

	return `${fullHour}:${paddedMinute}${meridian}`
}

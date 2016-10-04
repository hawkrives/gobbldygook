// @flow
export function expandYear(year: number, short=false, separator='—') {
	if (short) {
		return expandYearToShort(year, separator)
	}
	return expandYearToFull(year, separator)
}

// 2012 => 2012-2013
export function expandYearToFull(year: number, separator='—') {
	if (year === undefined) {
		return '???'
	}
	let nextYear = parseInt(year, 10) + 1
	return `${year}${separator}${nextYear}`
}

// 2012 => 2012-13
export function expandYearToShort(year: number, separator='—') {
	if (year === undefined) {
		return '???'
	}
	let nextYear = parseInt(year, 10) + 1
	nextYear = String(nextYear).substr(-2, 2)
	return `${year}${separator}${nextYear}`
}

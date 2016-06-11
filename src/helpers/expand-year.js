/**
 * Takes a year and expands it.
 * eg. expendYear('2012') => 2012-13
 *
 * @param {String|Number} year - the year to expand
 * @returns {String} - the expanded year
 */
export default function expandYear(year, short=false, seperator='—') {
	if (year === undefined) {
		return '???'
	}
	let nextYear = parseInt(year, 10) + 1
	if (short) {
		nextYear = String(nextYear).substr(-2, 2)
	}
	return `${year}${seperator}${(nextYear)}`
}

/**
 * Takes a year and expands it.
 * eg. expendYear(2012) => 2012-13
 *
 * @param {Number} year - the year to expand
 * @returns {String} - the expanded year
 */
export default function expandYear(year, short=false, seperator='—') {
	const thisYear = year
	let nextYear = parseInt(thisYear, 10) + 1
	if (short) {
		nextYear = String(nextYear).substr(-2, 2)
	}
	return `${thisYear}${seperator}${(nextYear)}`
}

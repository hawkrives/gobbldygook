// @flow

/* Takes a year and expands it.
 * eg. expendYear('2012') => 2012-13
 */
export default function expandYear(year: string|number, short?:boolean=false, seperator?:string='—'): string {
	if (year === undefined) {
		return '???'
	}
	let nextYear = parseInt(year, 10) + 1
	if (short) {
		nextYear = String(nextYear).substr(-2, 2)
	}
	return `${year}${seperator}${nextYear}`
}

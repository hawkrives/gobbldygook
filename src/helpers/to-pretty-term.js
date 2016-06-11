import semesterName from './semester-name'
import expandYear from './expand-year'

/**
 * Takes a term and makes it pretty.
 * eg. {in: 20121, out: Fall 2012-13}
 *
 * @param {Number} term - a term identifier.
 * @returns {String} - the prettied term
 */
export default function toPrettyTerm(term) {
	let strterm = String(term)
	const year = strterm.substr(0, 4)
	const sem = strterm.substr(4, 1)

	return `${semesterName(sem)} ${expandYear(year)}`
}

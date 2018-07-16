// @flow

import {semesterName} from './semester-name'
import {expandYear} from './expand-year'

/* Takes a term and makes it pretty.
 * eg. {in: 20121, out: Fall 2012-13}
 */
export function toPrettyTerm(term: string): string {
	let year = term.substr(0, 4)
	let sem = term.substr(4, 2)

	return `${semesterName(sem)} ${expandYear(year)}`
}

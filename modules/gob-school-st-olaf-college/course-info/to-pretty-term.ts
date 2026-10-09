import { semesterName } from "./semester-name.ts"
import { expandYear } from "./expand-year.ts"

/* Takes a term and makes it pretty.
 * eg. {in: 20121, out: Fall 2012-13}
 */
export function toPrettyTerm(term: number | string): string {
  const strterm = String(term)
  const year = strterm.slice(0, 4)
  const sem = strterm.slice(4, 5)
  return `${semesterName(sem)} ${expandYear(year)}`
}

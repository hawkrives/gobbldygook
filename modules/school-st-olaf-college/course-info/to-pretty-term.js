// @flow
'use strict'

const { semesterName } = require('./semester-name')
const { expandYear } = require('./expand-year')

/* Takes a term and makes it pretty.
 * eg. {in: 20121, out: Fall 2012-13}
 */
function toPrettyTerm(term: number): string {
    const strterm = String(term)
    const year = strterm.substr(0, 4)
    const sem = strterm.substr(4, 1)

    return `${semesterName(sem)} ${expandYear(year)}`
}

module.exports.toPrettyTerm = toPrettyTerm
